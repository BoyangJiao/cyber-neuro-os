import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { PluginOption } from 'vite'
import { fetch as undiciFetch, ProxyAgent } from 'undici'
import { SYSTEM_PROMPT } from './src/data/agentSystemPrompt'

/**
 * Local API proxy plugin
 * Intercepts /api/chat and /api/sanity requests during dev.
 */
function apiProxy(env: Record<string, string>): PluginOption {
  const proxyUrl = env.PROXY_URL
  const sanityProjectId = env.VITE_SANITY_PROJECT_ID || 'argneoi8'

  // Create proxy dispatcher if local proxy URL is configured (e.g. Clash)
  const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : undefined

  if (dispatcher) {
    console.log(`[api-proxy] Using HTTP proxy: ${proxyUrl}`)
  }

  return {
    name: 'api-proxy',
    configureServer(server) {
      // 1. Sanity Proxy (Bypasses direct browser-to-sanity connection)
      server.middlewares.use('/api/sanity', async (req, res) => {
        try {
          // Forward path and query to Sanity API
          const urlObj = new URL(req.url || '', 'http://localhost')
          const targetUrl = `https://${sanityProjectId}.api.sanity.io${urlObj.pathname.replace('/api/sanity', '')}${urlObj.search}`

          const sanityRes = await undiciFetch(targetUrl, {
            method: req.method,
            headers: Object.fromEntries(
              Object.entries(req.headers).filter(([k, v]) => k !== 'host' && k !== 'origin' && typeof v === 'string')
            ) as Record<string, string>,
            ...(dispatcher ? { dispatcher } : {}),
          })

          res.writeHead(sanityRes.status, {
            'Content-Type': sanityRes.headers.get('content-type') || 'application/json',
            'Access-Control-Allow-Origin': '*',
          })

          const body = await sanityRes.arrayBuffer()
          res.end(Buffer.from(body))
        } catch (err) {
          console.error('[sanity-proxy] Error:', err)
          res.writeHead(500)
          res.end(JSON.stringify({ error: 'Sanity proxy error' }))
        }
      })

      // 2. DashScope Proxy (OpenAI Compatible)
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const apiKey = (env.DASHSCOPE_API_KEY || '').trim()
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'DASHSCOPE_API_KEY not set' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const parsedBody = JSON.parse(body)
            const messages = parsedBody.messages || []

            if (messages.length === 0) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'No messages provided' }))
              return
            }

            const formattedMessages = [
              { role: 'system', content: SYSTEM_PROMPT },
              ...messages.map((m: any) => ({
                role: m.role,
                content: m.content,
              })),
            ];

            const apiUrl = 'https://coding.dashscope.aliyuncs.com/v1/chat/completions';

            const dsRes = await undiciFetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: 'qwen-turbo',
                messages: formattedMessages,
                stream: true,
                temperature: 0.3,
              }),
              // REMOVED dispatcher: dashscope is a domestic service, bypassing local proxy for better stability
            })

            if (!dsRes.ok) {
              const errText = await dsRes.text()
              console.error('[dashscope-proxy] API Error:', {
                status: dsRes.status,
                statusText: dsRes.statusText,
                details: errText
              })
              res.writeHead(dsRes.status, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'DashScope API error', details: errText }))
              return
            }

            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            })

            const reader = dsRes.body?.getReader()
            if (!reader) { res.end(); return }

            const decoder = new TextDecoder()
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(decoder.decode(value, { stream: true }))
            }
            res.end()
          } catch (err) {
            console.error('[dashscope-proxy] Error:', err)
            if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Proxy error' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env from .env.local
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), apiProxy(env)],
    optimizeDeps: {
      include: ['@sanity/visual-editing/react', 'styled-components']
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api/music': {
          target: 'https://www.soundhelix.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/music/, ''),
        }
      }
    }
  }
})

