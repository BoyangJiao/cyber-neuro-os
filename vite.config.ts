import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { PluginOption } from 'vite'
import { fetch as undiciFetch, ProxyAgent } from 'undici'
import { SYSTEM_PROMPT } from './src/data/agentSystemPrompt'

/**
 * Local Gemini API proxy plugin
 * Intercepts /api/chat requests during dev and proxies to Gemini Flash.
 * Reads GEMINI_API_KEY from .env.local
 * Uses undici ProxyAgent to route through local HTTP proxy (Clash Verge etc.)
 */
function geminiProxy(apiKey: string | undefined, proxyUrl: string | undefined): PluginOption {
  // Create proxy dispatcher if proxy URL is configured
  const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : undefined

  if (dispatcher) {
    console.log(`[gemini-proxy] Using HTTP proxy: ${proxyUrl}`)
  } else {
    console.log('[gemini-proxy] No PROXY_URL set, connecting directly')
  }

  return {
    name: 'gemini-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY not set in .env.local' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const { messages } = JSON.parse(body)

            const geminiContents = messages
              .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
              .map((m: { role: string; content: string }) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
              }))

            const systemInstruction = {
              parts: [{
                text: SYSTEM_PROMPT
              }],
            }

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`

            const geminiRes = await undiciFetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: geminiContents,
                systemInstruction,
                generationConfig: { maxOutputTokens: 1024, temperature: 0.7, topP: 0.9 },
              }),
              ...(dispatcher ? { dispatcher } : {}),
            })

            if (!geminiRes.ok) {
              const errText = await geminiRes.text()
              res.writeHead(geminiRes.status, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Gemini API error', details: errText }))
              return
            }

            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            })

            // Stream the response through
            const reader = geminiRes.body?.getReader()
            if (!reader) {
              res.end()
              return
            }

            const decoder = new TextDecoder()
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(decoder.decode(value, { stream: true }))
            }
            res.end()
          } catch (err) {
            console.error('[gemini-proxy] Error:', err)
            if (!res.headersSent) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
            }
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
    plugins: [react(), tailwindcss(), geminiProxy(env.GEMINI_API_KEY, env.PROXY_URL)],
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

