import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import App from './App.tsx'

// NOTE: StrictMode disabled for Arwes compatibility
// Arwes officially does not support React StrictMode
// See: https://arwes.dev/docs/develop/fundamentals/react

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
