// Converts the original photos in assets-src/images into web-ready WebP files
// in public/images. Run with: npm run images
import { readdir, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'assets-src/images'
const OUT = 'public/images'
const SIZES = [
  { suffix: '', width: 1800, quality: 78 },
  { suffix: '-sm', width: 760, quality: 72 },
  { suffix: '-xs', width: 420, quality: 70 },
]

const slug = (name) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/&/g, 'and')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

await mkdir(OUT, { recursive: true })
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|jfif|webp)$/i.test(f))

for (const file of files) {
  const input = path.join(SRC, file)
  const base = slug(file)
  const meta = await sharp(input).metadata()
  for (const s of SIZES) {
    const out = path.join(OUT, `${base}${s.suffix}.webp`)
    await sharp(input)
      .rotate()
      .resize({ width: Math.min(s.width, meta.width), withoutEnlargement: true })
      .webp({ quality: s.quality, effort: 5 })
      .toFile(out)
  }
  console.log(`${file.padEnd(32)} -> ${base}.webp (${meta.width}x${meta.height})`)
}

// The logo also ships as JPEG for the favicon and social previews.
await copyFile(path.join(SRC, 'logo.jpeg'), path.join(OUT, 'logo.jpeg'))
