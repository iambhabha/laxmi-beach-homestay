import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { ThemeProvider } from './theme'

/** Renders the page to HTML at build time so crawlers and link previews see real content. */
export function render() {
  return renderToString(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  )
}
