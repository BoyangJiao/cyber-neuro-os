import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import '@fontsource/rajdhani/300.css'
import '@fontsource/rajdhani/400.css'
import '@fontsource/rajdhani/500.css'
import '@fontsource/rajdhani/600.css'
import '@fontsource/rajdhani/700.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@fontsource-variable/orbitron/index.css'
import './styles/fonts-sc.css'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import App from './App.tsx'

// GLOBAL FETCH INTERCEPTOR (V4)
// This handles Sanity connectivity in restricted regions (like China)
// by forcing ALL requests to .sanity.io to go through our Vercel API Proxy.
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function (url: string | URL | Request, init?: RequestInit) {
    try {
      const urlStr = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : (url as Request).url);
      
      // Force proxy for any sanity.io related calls (API or CDN)
      if (urlStr.includes('.sanity.io') && !urlStr.includes('/api/sanity')) {
        const proxiedUrl = urlStr.replace(/^https:\/\/[^/]+/, window.location.origin + '/api/sanity');
        return originalFetch(proxiedUrl, init);
      }
    } catch (e) {
      console.warn('[FetchInterceptor] Failed to parse URL, falling back to original fetch', e);
    }
    return originalFetch(url, init);
  };
}

// NOTE: StrictMode previously disabled for legacy reasons. Can be re-enabled if needed.

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    <Analytics />
    <SpeedInsights />
  </BrowserRouter>
)
