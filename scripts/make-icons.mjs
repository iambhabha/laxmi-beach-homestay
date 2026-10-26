// Builds the PNG and ICO favicons from public/favicon.svg. Run with: npm run icons
import { readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const svg = await readFile('public/favicon.svg')
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()

await writeFile('public/apple-touch-icon.png', await png(180))
await writeFile('public/icon-192.png', await png(192))
await writeFile('public/icon-512.png', await png(512))

// ICO with embedded PNGs (16, 32, 48), supported by every current browser.
const sizes = [16, 32, 48]
const images = await Promise.all(sizes.map(png))
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = 6 + 16 * sizes.length
const entries = sizes.map((size, i) => {
  const e = Buffer.alloc(16)
  e.writeUInt8(size, 0)
  e.writeUInt8(size, 1)
  e.writeUInt16LE(1, 4)
  e.writeUInt16LE(32, 6)
  e.writeUInt32LE(images[i].length, 8)
  e.writeUInt32LE(offset, 12)
  offset += images[i].length
  return e
})
await writeFile('public/favicon.ico', Buffer.concat([header, ...entries, ...images]))
console.log('icons written')
