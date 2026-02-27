import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Local fonts (via fontsource) — eliminates external Google Fonts request
import '@fontsource/bai-jamjuree/200.css'
import '@fontsource/bai-jamjuree/300.css'
import '@fontsource/bai-jamjuree/400.css'
import '@fontsource/bai-jamjuree/500.css'
import '@fontsource/bai-jamjuree/600.css'
import '@fontsource/bai-jamjuree/700.css'
import '@fontsource/bai-jamjuree/200-italic.css'
import '@fontsource/bai-jamjuree/300-italic.css'
import '@fontsource/bai-jamjuree/400-italic.css'
import '@fontsource/bai-jamjuree/500-italic.css'
import '@fontsource/bai-jamjuree/600-italic.css'
import '@fontsource/bai-jamjuree/700-italic.css'
import '@fontsource-variable/orbitron'
import '@fontsource/share-tech-mono'
import '@fontsource-variable/noto-sans-sc'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import App from './App.tsx'

// NOTE: StrictMode previously disabled for legacy reasons. Can be re-enabled if needed.

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
