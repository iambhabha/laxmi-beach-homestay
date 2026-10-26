// Synthesises an original, royalty-free "beach" background track:
// ocean waves, a soft chord pad, a gentle bass and a marimba-like melody
// in C major pentatonic. Writes a 16-bit stereo WAV.
// Usage: node scripts/make-music.mjs <seconds> <out.wav>
import { writeFileSync } from 'node:fs'

const seconds = Number(process.argv[2] || 40)
const out = process.argv[3] || 'assets-src/beach-music.wav'
const SR = 44100
const N = Math.floor(seconds * SR)
const L = new Float32Array(N)
const R = new Float32Array(N)

const BPM = 84
const beat = 60 / BPM
const bar = beat * 4
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12)

// Deterministic noise so every build sounds the same.
let seed = 12345
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1

// --- Ocean waves: low-passed brown noise swelling every ~7 s ---
let bl = 0, br = 0, lpL = 0, lpR = 0
for (let i = 0; i < N; i++) {
  const t = i / SR
  bl = (bl + rand() * 0.02) * 0.995
  br = (br + rand() * 0.02) * 0.995
  const swell = Math.pow(0.5 + 0.5 * Math.sin((2 * Math.PI * t) / 7.3 - 1.2), 2.2)
  const cutoff = 0.02 + 0.06 * swell
  lpL += (bl - lpL) * cutoff
  lpR += (br - lpR) * cutoff
  L[i] += lpL * (0.2 + 0.85 * swell)
  R[i] += lpR * (0.2 + 0.85 * swell)
}

// --- Chords: Cmaj7, Am7, Fmaj7, G6 ---
const chords = [
  [48, [60, 64, 67, 71]],
  [45, [57, 60, 64, 67]],
  [41, [57, 60, 64, 65]],
  [43, [59, 62, 67, 64]],
]

function addTone(start, dur, f, amp, pan, shape) {
  const s0 = Math.floor(start * SR)
  const len = Math.floor(dur * SR)
  for (let k = 0; k < len && s0 + k < N; k++) {
    const t = k / SR
    const v = shape(t, f) * amp
    L[s0 + k] += v * (1 - pan)
    R[s0 + k] += v * pan
  }
}

const pad = (dur) => (t, f) => {
  const env = Math.min(1, t / 0.9) * Math.min(1, (dur - t) / 1.2)
  return env * (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 1.003 * t) + 0.12 * Math.sin(4 * Math.PI * f * t))
}
const bass = (t, f) => Math.exp(-t * 1.6) * (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(4 * Math.PI * f * t))
const marimba = (t, f) =>
  Math.exp(-t * 3.2) * Math.sin(2 * Math.PI * f * t) + 0.35 * Math.exp(-t * 14) * Math.sin(2 * Math.PI * f * 3.98 * t)

// Melody over each 4-bar phrase, in eighth-note steps (null = rest).
const phrase = [
  [72, null, 76, 79, null, 76, 74, null],
  [69, null, 72, 76, null, 74, 72, null],
  [69, 72, null, 77, 76, null, 72, null],
  [71, null, 74, 79, null, 76, 74, 72],
]

const bars = Math.ceil(seconds / bar)
for (let b = 0; b < bars; b++) {
  const t0 = b * bar
  const [root, notes] = chords[b % 4]
  notes.forEach((n, i) => addTone(t0, bar + 0.6, hz(n), 0.035, 0.3 + i * 0.13, pad(bar + 0.6)))
  addTone(t0, bar, hz(root), 0.16, 0.5, bass)
  addTone(t0 + beat * 2.5, bar - beat * 2.5, hz(root + 7), 0.07, 0.5, bass)
  if (b >= 1) {
    phrase[b % 4].forEach((n, step) => {
      if (n == null) return
      const swing = step % 2 ? 0.04 : 0
      addTone(t0 + step * (beat / 2) + swing, 1.6, hz(n), 0.11, 0.35 + (step % 3) * 0.15, marimba)
    })
  }
}

// --- A little room: three feedback delays for a soft reverb tail ---
for (const [ms, fb, mix] of [[113, 0.32, 0.18], [167, 0.28, 0.14], [229, 0.25, 0.12]]) {
  const d = Math.floor((ms / 1000) * SR)
  for (let i = d; i < N; i++) {
    L[i] += R[i - d] * fb * mix
    R[i] += L[i - d] * fb * mix
  }
}

// Fade in/out and normalise to a comfortable level.
const fade = 2 * SR
let peak = 0
for (let i = 0; i < N; i++) {
  const g = Math.min(1, i / fade, (N - i) / fade)
  L[i] *= g
  R[i] *= g
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
}
const gain = 0.7 / peak

const data = Buffer.alloc(N * 4)
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain)) * 32767), i * 4)
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain)) * 32767), i * 4 + 2)
}
const header = Buffer.alloc(44)
header.write('RIFF', 0)
header.writeUInt32LE(36 + data.length, 4)
header.write('WAVEfmt ', 8)
header.writeUInt32LE(16, 16)
header.writeUInt16LE(1, 20)
header.writeUInt16LE(2, 22)
header.writeUInt32LE(SR, 24)
header.writeUInt32LE(SR * 4, 28)
header.writeUInt16LE(4, 32)
header.writeUInt16LE(16, 34)
header.write('data', 36)
header.writeUInt32LE(data.length, 40)
writeFileSync(out, Buffer.concat([header, data]))
console.log(`wrote ${out} (${seconds}s)`)
