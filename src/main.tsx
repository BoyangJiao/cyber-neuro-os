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

// GLOBAL NETWORK INTERCEPTOR (V5 - Fetch + XHR)
// This ensures ALL network traffic to Sanity (regardless of the library used)
// goes through our Vercel API Proxy to bypass domestic network restrictions.
if (typeof window !== 'undefined') {
  const originPath = window.location.origin;

  // 1. Hijack Fetch API
  const originalFetch = window.fetch;
  window.fetch = function (url, init) {
    try {
      const urlStr = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : (url as Request).url);
      
      // Sanity Proxy
      if (urlStr.includes('.sanity.io') && !urlStr.includes('/api/sanity')) {
        const proxiedUrl = urlStr.replace(/^https:\/\/[^/]+/, originPath + '/api/sanity');
        console.log(`[Proxy-Fetch] Redirecting: ${urlStr} -> ${proxiedUrl}`);
        return originalFetch(proxiedUrl, init);
      }
      
      // Emulator Proxy (Intercept both jsdelivr and emulatorjs.org)
      if ((urlStr.includes('cdn.jsdelivr.net/gh/ethanaobrien/emulatorjs') || urlStr.includes('cdn.emulatorjs.org')) && !urlStr.includes('/api/emulator')) {
        const proxiedUrl = urlStr.replace(/^https:\/\/[^/]+/, originPath + '/api/emulator');
        console.log(`[Proxy-Emulator-Fetch] Redirecting: ${urlStr} -> ${proxiedUrl}`);
        return originalFetch(proxiedUrl, init);
      }
    } catch (e) { /* ignore */ }
    return originalFetch(url, init);
  };

  // 2. Hijack XMLHttpRequest (XHR)
  const originalOpen = XMLHttpRequest.prototype.open;
  (XMLHttpRequest.prototype as any).open = function (method: string, url: string | URL, ...rest: any[]) {
    let targetUrl = url;
    const urlStr = typeof url === 'string' ? url : url.toString();
    
    // Sanity Proxy
    if (urlStr.includes('.sanity.io') && !urlStr.includes('/api/sanity')) {
      targetUrl = urlStr.replace(/^https:\/\/[^/]+/, originPath + '/api/sanity');
    }
    
    // Emulator Proxy
    if ((urlStr.includes('cdn.jsdelivr.net/gh/ethanaobrien/emulatorjs') || urlStr.includes('cdn.emulatorjs.org')) && !urlStr.includes('/api/emulator')) {
      targetUrl = urlStr.replace(/^https:\/\/[^/]+/, originPath + '/api/emulator');
      console.log(`[Proxy-Emulator-XHR] Redirecting: ${url} -> ${targetUrl}`);
    }
    
    return (originalOpen as any).apply(this, [method, targetUrl, ...rest]);
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
