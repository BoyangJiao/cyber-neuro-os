import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import App from './App.tsx'

// NOTE: StrictMode previously disabled for legacy reasons. Can be re-enabled if needed.

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
