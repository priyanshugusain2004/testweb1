import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Dynamically import Capacitor plugins to avoid build-time errors

// Register the PWA service worker (fallback: register generated /sw.js)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      // registration successful
      // you can add update handling here if desired
      console.log('ServiceWorker registration successful with scope: ', reg.scope)
    }).catch(err => {
      console.warn('ServiceWorker registration failed:', err)
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Try to set keyboard resize mode on supported Capacitor platforms
;(async () => {
  try {
    const mod = await import('@capacitor/keyboard')
    const Keyboard = mod && mod.Keyboard ? mod.Keyboard : mod
    if (Keyboard && Keyboard.setResizeMode) {
      Keyboard.setResizeMode({ mode: 'native' }).catch(() => {})
    }
  } catch {
    // ignore: when plugin isn't installed or running in unsupported environment
  }
})()
