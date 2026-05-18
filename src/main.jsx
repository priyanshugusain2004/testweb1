import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register the PWA service worker (vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register'
const updateSW = registerSW({ onNeedRefresh() { /* noop */ }, onOfflineReady() { /* noop */ } })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
