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
  const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : undefined

  if (dispatcher) {
    console.log(`[api-proxy] Using HTTP proxy for outbound calls: ${proxyUrl}`)
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

          const sanityRes: any = await undiciFetch(targetUrl, {
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
          if (!res.headersSent) {
            res.writeHead(500)
            res.end(JSON.stringify({ error: 'Sanity proxy error' }))
          }
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

            // Endpoint + model env-configurable (defaults = Coding Plan endpoint).
            const apiUrl = (env.CHAT_API_URL || 'https://coding.dashscope.aliyuncs.com/v1/chat/completions').trim()
            const chatModel = (env.CHAT_MODEL || 'qwen3.5-plus').trim()

            const dsRes: any = await undiciFetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: chatModel,
                messages: formattedMessages,
                stream: true,
                temperature: 0.5,
                max_tokens: 1536,
                enable_thinking: false, // SKIP slow reasoning
              }),
              ...(dispatcher ? { dispatcher } : {}),
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

            if (!dsRes.body) { res.end(); return }

            const decoder = new TextDecoder()
            // Robust streaming for different stream types (Web Stream or Node Readable)
            const streamBody = dsRes.body as any
            if (typeof streamBody.getReader === 'function') {
              const reader = streamBody.getReader()
              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                res.write(decoder.decode(value, { stream: true }))
              }
            } else {
              // Node.js Readable / undici stream
              for await (const chunk of streamBody) {
                res.write(decoder.decode(chunk, { stream: true }))
              }
            }
            res.end()
          } catch (err) {
            console.error('[dashscope-proxy] Error:', err)
            if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Proxy error' }))
          }
        })
      })

      // 3. DashScope TTS Proxy (HTTP SpeechSynthesizer → audio bytes)
      server.middlewares.use('/api/tts', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405); res.end(JSON.stringify({ error: 'Method not allowed' })); return
        }
        const apiKey = (env.DASHSCOPE_API_KEY || '').trim()
        if (!apiKey) {
          res.writeHead(501, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'TTS not configured' })); return
        }
        let body = ''
        req.on('data', (c: Buffer) => { body += c.toString() })
        req.on('end', async () => {
          try {
            const text = (JSON.parse(body || '{}').text || '').slice(0, 2000)
            if (!text.trim()) { res.writeHead(400); res.end(JSON.stringify({ error: 'No text' })); return }
            const model = (env.TTS_MODEL || 'qwen3-tts-flash').trim()
            const voice = (env.TTS_VOICE || 'Kai').trim()
            const languageType = /[一-鿿]/.test(text) ? 'Chinese' : 'English'
            const upstream: any = await undiciFetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ model, input: { text, voice, language_type: languageType } }),
              ...(dispatcher ? { dispatcher } : {}),
            })
            const json: any = await upstream.json().catch(() => null)
            const url = json?.output?.audio?.url
            if (upstream.ok && url) {
              const audio: any = await undiciFetch(url, { ...(dispatcher ? { dispatcher } : {}) })
              res.writeHead(200, { 'Content-Type': audio.headers.get('content-type') || 'audio/mpeg', 'Cache-Control': 'no-store' })
              res.end(Buffer.from(await audio.arrayBuffer())); return
            }
            console.error('[tts-proxy] no audio from upstream:', upstream.status, JSON.stringify(json))
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'TTS produced no audio', details: json }))
          } catch (err) {
            console.error('[tts-proxy] Error:', err)
            if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'TTS proxy error' }))
          }
        })
      })

      // 4. DashScope ASR Proxy (Qwen3-ASR-Flash, OpenAI-compatible)
      server.middlewares.use('/api/asr', async (req, res) => {
        if (req.method !== 'POST') { res.writeHead(405); res.end(JSON.stringify({ error: 'Method not allowed' })); return }
        const apiKey = (env.DASHSCOPE_API_KEY || '').trim()
        if (!apiKey) { res.writeHead(501, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'ASR not configured' })); return }
        let body = ''
        req.on('data', (c: Buffer) => { body += c.toString() })
        req.on('end', async () => {
          try {
            const audio = JSON.parse(body || '{}').audio || ''
            if (!String(audio).startsWith('data:audio')) { res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid audio' })); return }
            const url = (env.ASR_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions').trim()
            const model = (env.ASR_MODEL || 'qwen3-asr-flash').trim()
            const upstream: any = await undiciFetch(url, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: [{ type: 'input_audio', input_audio: { data: audio } }] }],
                stream: false,
                asr_options: { enable_itn: true },
              }),
              ...(dispatcher ? { dispatcher } : {}),
            })
            const json: any = await upstream.json().catch(() => null)
            const text = json?.choices?.[0]?.message?.content
            if (upstream.ok && typeof text === 'string') {
              res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ text })); return
            }
            console.error('[asr-proxy] no transcript:', upstream.status, JSON.stringify(json))
            res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'ASR produced no text', details: json }))
          } catch (err) {
            console.error('[asr-proxy] Error:', err)
            if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'ASR proxy error' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }: { mode: string }) => {
  // Load env from .env.local
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), apiProxy(env)],
    optimizeDeps: {
      include: ['@sanity/visual-editing/react', 'styled-components']
    },
    build: {
      // Split the heavy, independently-cacheable vendor libs out of the main
      // bundle. Three.js, Sanity, the animation stack, and Tone are large and
      // change on different cadences than app code — separate chunks let the
      // browser cache them across deploys and parallelize download.
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (!id.includes('node_modules')) return undefined
            if (/[\\/]node_modules[\\/](three|three-stdlib|@react-three)[\\/]/.test(id)) return 'vendor-three'
            if (/[\\/]node_modules[\\/]@sanity[\\/]/.test(id)) return 'vendor-sanity'
            if (/[\\/]node_modules[\\/](framer-motion|gsap|@gsap)[\\/]/.test(id)) return 'vendor-motion'
            if (/[\\/]node_modules[\\/]tone[\\/]/.test(id)) return 'vendor-tone'
            return 'vendor'
          },
        },
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api/music': {
          target: 'https://www.soundhelix.com',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/music/, ''),
        }
      }
    }
  }
})
