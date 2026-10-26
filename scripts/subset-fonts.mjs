// Cuts the Marathi (Devanagari) font down to the letters the site actually
// uses (the thali names), so it costs a few KB instead of ~100 KB.
// Runs before every build; re-run after adding Marathi text anywhere in src/.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import subsetFont from 'subset-font'

const SOURCE = 'node_modules/@fontsource/tiro-devanagari-marathi/files/tiro-devanagari-marathi-devanagari-400-normal.woff2'
const OUT = 'src/fonts/tiro-devanagari-marathi-subset.woff2'

async function* files(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* files(p)
    else if (/\.(jsx?|html)$/.test(e.name)) yield p
  }
}

let text = ''
for await (const f of files('src')) text += (await readFile(f, 'utf8')).match(/[\u0900-\u097F\u200C\u200D]+/g)?.join('') ?? ''
const chars = [...new Set(text)].join('')
const font = await subsetFont(await readFile(SOURCE), chars, { targetFormat: 'woff2' })
await writeFile(OUT, font)
console.log(`Marathi font: ${chars.length} characters, ${Math.round(font.length / 1024)} KB`)
