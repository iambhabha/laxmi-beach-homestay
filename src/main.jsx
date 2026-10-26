import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './theme'
// Self-hosted fonts (no request to Google before the page can paint).
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import './index.css'

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

// The build pre-renders the page into #root. Hydrating keeps that HTML on
// screen instead of drawing the whole page a second time; the flag also tells
// the hero to skip its entrance fade. The dev server has no pre-rendered HTML.
window.__PRERENDERED__ = root.hasChildNodes()
if (window.__PRERENDERED__) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)
