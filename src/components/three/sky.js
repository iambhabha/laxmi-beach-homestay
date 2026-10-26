// Sun and moon for Malvan, from the NOAA solar position equations.
// Accurate to well under a degree, which is plenty for painting a sky.

export const MALVAN = { lat: 16.0545, lon: 73.4658, tz: 'Asia/Kolkata' }

const rad = Math.PI / 180

function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5
}

/** Solar elevation and azimuth in degrees (azimuth clockwise from north). */
export function sunPosition(date, lat = MALVAN.lat, lon = MALVAN.lon) {
  const jc = (julianDay(date) - 2451545) / 36525
  const L0 = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360
  const M = 357.52911 + jc * (35999.05029 - 0.0001537 * jc)
  const e = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc)
  const C =
    Math.sin(M * rad) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) +
    Math.sin(2 * M * rad) * (0.019993 - 0.000101 * jc) +
    Math.sin(3 * M * rad) * 0.000289
  const trueLong = L0 + C
  const omega = 125.04 - 1934.136 * jc
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * rad)
  const eps0 = 23 + (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60
  const eps = eps0 + 0.00256 * Math.cos(omega * rad)
  const decl = Math.asin(Math.sin(eps * rad) * Math.sin(lambda * rad)) / rad

  const y = Math.tan((eps / 2) * rad) ** 2
  const eqTime =
    4 / rad *
    (y * Math.sin(2 * L0 * rad) -
      2 * e * Math.sin(M * rad) +
      4 * e * y * Math.sin(M * rad) * Math.cos(2 * L0 * rad) -
      0.5 * y * y * Math.sin(4 * L0 * rad) -
      1.25 * e * e * Math.sin(2 * M * rad))

  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60
  const trueSolarTime = (((utcMinutes + eqTime + 4 * lon) % 1440) + 1440) % 1440
  const hourAngle = trueSolarTime / 4 - 180

  const cosZenith =
    Math.sin(lat * rad) * Math.sin(decl * rad) + Math.cos(lat * rad) * Math.cos(decl * rad) * Math.cos(hourAngle * rad)
  const zenith = Math.acos(Math.min(1, Math.max(-1, cosZenith))) / rad
  const elevation = 90 - zenith

  const azDen = Math.cos(lat * rad) * Math.sin(zenith * rad)
  let azimuth = 180
  if (Math.abs(azDen) > 1e-6) {
    const azCos = (Math.sin(lat * rad) * Math.cos(zenith * rad) - Math.sin(decl * rad)) / azDen
    const a = Math.acos(Math.min(1, Math.max(-1, azCos))) / rad
    azimuth = hourAngle > 0 ? (a + 180) % 360 : (540 - a) % 360
  }
  return { elevation, azimuth }
}

/** Today's sunset in Malvan (first time after local noon the sun drops below −0.833°). */
export function sunsetToday(now = new Date()) {
  const ist = new Date(now.getTime() + 5.5 * 3600000)
  // Local noon in IST is 06:30 UTC.
  let lo = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate(), 6, 30)
  let hi = lo + 9 * 3600000
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2
    if (sunPosition(new Date(mid)).elevation > -0.833) lo = mid
    else hi = mid
  }
  return new Date(Math.round(lo / 60000) * 60000)
}

/** Moon phase: 0 = new, 0.5 = full. Illuminated fraction 0–1. */
export function moonPhase(date = new Date()) {
  const synodic = 29.530588853
  const knownNew = Date.UTC(2000, 0, 6, 18, 14) // a reference new moon
  const days = (date.getTime() - knownNew) / 86400000
  const phase = (((days / synodic) % 1) + 1) % 1
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2
  return { phase, illumination }
}

export const formatTime = (d) =>
  d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: MALVAN.tz }).toUpperCase()

/**
 * The time the sky is drawn for. Add ?sky=day|golden|sunset|dusk|night or
 * ?time=18:10 (IST) to the URL to preview other moments.
 */
export function skyClock(now = new Date()) {
  if (typeof window === 'undefined') return now
  const params = new URLSearchParams(window.location.search)
  const sunset = sunsetToday(now).getTime()
  const min = 60000
  const ist = new Date(now.getTime() + 5.5 * 3600000)
  const at = (h, m) => Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate(), h, m) - 5.5 * 3600000
  const presets = { day: at(12, 30), golden: sunset - 55 * min, sunset: sunset - 14 * min, dusk: sunset + 24 * min, night: at(21, 30) }
  const preset = presets[params.get('sky')]
  if (preset) return new Date(preset)
  const t = params.get('time')
  if (t && /^\d{1,2}:\d{2}$/.test(t)) {
    const [h, m] = t.split(':').map(Number)
    return new Date(at(h, m))
  }
  return now
}
