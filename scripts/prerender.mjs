// Pre-renders the page into dist/index.html after `vite build`, so search
// engines and link previews get the full content without running JavaScript.
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
  const html = render()
  const file = 'dist/index.html'
  const page = await readFile(file, 'utf8')
  if (!page.includes('<div id="root"></div>')) throw new Error('root placeholder not found in dist/index.html')
  let out = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`)

  // Inline the stylesheet so the first paint doesn't wait for a second request.
  const link = out.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
  if (link) {
    const css = await readFile(`dist${link[1]}`, 'utf8')
    out = out.replace(link[0], () => `<style>${css}</style>`)
    console.log(`inlined ${link[1]} (${Math.round(css.length / 1024)} KB)`)
  }

  // Preload the heading and body fonts used above the fold.
  const fonts = (await readdir('dist/assets')).filter((f) => /^(fraunces-latin-opsz-normal|plus-jakarta-sans-latin-wght-normal)-.*\.woff2$/.test(f))
  const preload = fonts.map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`).join('\n  ')
  out = out.replace('</title>', `</title>\n  ${preload}`)
  console.log(`preloaded fonts: ${fonts.join(', ')}`)
  // The app script only adds interactivity to HTML that is already on screen,
  // so let the fonts and photos above the fold download ahead of it.
  out = out.replace(/<script type="module" crossorigin src=/, '<script type="module" crossorigin fetchpriority="low" src=')

  await writeFile(file, out)

  // Allow exactly the page's inline scripts (the theme snippet) in the CSP.
  const hashes = [...out.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map(([, js]) => `'sha256-${createHash('sha256').update(js).digest('base64')}'`)
  const headers = await readFile('dist/_headers', 'utf8')
  if (!headers.includes('{{INLINE_SCRIPT_HASHES}}')) throw new Error('CSP placeholder not found in dist/_headers')
  await writeFile('dist/_headers', headers.replace('{{INLINE_SCRIPT_HASHES}}', hashes.join(' ')))
  console.log(`CSP allows ${hashes.length} inline script(s)`)
  console.log(`prerendered ${Math.round(html.length / 1024)} KB of HTML into ${file}`)
} finally {
  await vite.close()
}
