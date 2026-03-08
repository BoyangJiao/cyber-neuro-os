import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
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

// NOTE: StrictMode previously disabled for legacy reasons. Can be re-enabled if needed.

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    <Analytics />
  </BrowserRouter>
)
