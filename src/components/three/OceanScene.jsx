import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { moonPhase, sunPosition } from './sky'

// The sky over Malvan at the real time of day, looking west from the
// homestay towards Sindhudurg Fort. Everything is procedural.

const hex = (h) => new THREE.Color(h)

// Sky and sea colours keyed by the sun's elevation in degrees. The dark theme
// keeps the sea near-black at every hour so reflections carry the colour.
const KEYS = [
  { el: -18, top: '#03050c', mid: '#070d22', rose: '#121c3c', horizon: '#24315a', deep: '#010102', shallow: '#060708', fog: '#111a33', fort: '#05070d', stars: 1, glow: 0 },
  { el: -7, top: '#080d1f', mid: '#18204a', rose: '#3d3463', horizon: '#c0705c', deep: '#010102', shallow: '#08090b', fog: '#5e4a66', fort: '#0e0c18', stars: 0.45, glow: 0.5 },
  { el: 0, top: '#090e1c', mid: '#292b5c', rose: '#b86161', horizon: '#fa9945', deep: '#020203', shallow: '#0b0c0e', fog: '#f2a35e', fort: '#2a1f30', stars: 0, glow: 1 },
  { el: 10, top: '#1c3466', mid: '#4a6da3', rose: '#d4a487', horizon: '#f5c690', deep: '#030304', shallow: '#0e1013', fog: '#e8c79f', fort: '#4b3d37', stars: 0, glow: 0.8 },
  { el: 35, top: '#17498f', mid: '#3f86c8', rose: '#8fc0e2', horizon: '#d3e9f2', deep: '#040506', shallow: '#121418', fog: '#cfe5ee', fort: '#6b5b50', stars: 0, glow: 0.5 },
]

// The light theme always shows a bright, soft morning over the bay.
const LIGHT = { top: '#5d9bd3', mid: '#9cc9ea', rose: '#cfe6f3', horizon: '#f3f9fb', deep: '#06607d', shallow: '#17b2c9', fog: '#e4f2f8', fort: '#7b6457', stars: 0, glow: 0.55 }
const LIGHT_SUN = { elevation: 20, azimuth: 262 }

export function paletteFor(elevation) {
  const e = Math.min(Math.max(elevation, KEYS[0].el), KEYS[KEYS.length - 1].el)
  let i = 0
  while (i < KEYS.length - 2 && e > KEYS[i + 1].el) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const t = (e - a.el) / (b.el - a.el)
  const mix = (k) => hex(a[k]).lerp(hex(b[k]), t)
  return {
    top: mix('top'), mid: mix('mid'), rose: mix('rose'), horizon: mix('horizon'),
    deep: mix('deep'), shallow: mix('shallow'), fog: mix('fog'), fort: mix('fort'),
    stars: a.stars + (b.stars - a.stars) * t,
    glow: a.glow + (b.glow - a.glow) * t,
  }
}

// Real elevation; azimuth squeezed towards due west so the sun stays near
// the fort in the frame instead of drifting behind the headline.
function sunDirection(elevation, azimuth) {
  const el = THREE.MathUtils.degToRad(Math.max(elevation, -20))
  const off = THREE.MathUtils.degToRad((azimuth - 270) * 0.3 + 3.4)
  return new THREE.Vector3(Math.sin(off) * Math.cos(el), Math.sin(el), -Math.cos(off) * Math.cos(el)).normalize()
}

function makeUniforms() {
  return {
    uTime: { value: 8 },
    uSunDir: { value: new THREE.Vector3(0, 0.05, -1) },
    uMoonDir: { value: new THREE.Vector3(0.1, 0.25, -1).normalize() },
    uMoonPhase: { value: 0.5 },
    uMoonVis: { value: 0 },
    uTop: { value: hex('#090e1c') },
    uMid: { value: hex('#292b5c') },
    uRose: { value: hex('#b86161') },
    uHorizon: { value: hex('#fa9945') },
    uDeep: { value: hex('#020b13') },
    uShallow: { value: hex('#052633') },
    uFogColor: { value: hex('#f2a35e') },
    uStars: { value: 0 },
    uGlow: { value: 1 },
  }
}

const SKY_GLSL = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uMoonDir;
  uniform float uMoonPhase;
  uniform float uMoonVis;
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uRose;
  uniform vec3 uHorizon;
  uniform float uStars;
  uniform float uGlow;

  float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }

  vec3 skyColor(vec3 dir, bool withBodies) {
    float y = clamp(dir.y, -0.2, 1.0);
    vec3 col = mix(uHorizon, uRose, smoothstep(0.0, 0.07, y));
    col = mix(col, uMid, smoothstep(0.05, 0.22, y));
    col = mix(col, uTop, smoothstep(0.2, 0.65, y));

    float d = max(dot(dir, uSunDir), 0.0);
    vec3 sunTint = mix(vec3(1.0, 0.62, 0.3), vec3(1.0, 0.95, 0.85), smoothstep(0.1, 0.5, uSunDir.y));
    col += sunTint * pow(d, 9.0) * 0.55 * uGlow;
    col += vec3(1.0, 0.8, 0.5) * pow(d, 120.0) * 0.9 * uGlow;
    if (withBodies) {
      col += vec3(1.0, 0.93, 0.78) * smoothstep(0.9993, 0.99965, d) * 2.0 * step(-0.01, uSunDir.y);

      // stars: a fixed field that fades out towards the horizon
      if (uStars > 0.0 && dir.y > 0.0) {
        vec3 p = dir * 420.0;
        vec3 cell = floor(p);
        float h = hash13(cell);
        float star = step(0.9965, h) * smoothstep(0.55, 0.0, length(fract(p) - 0.5));
        col += vec3(0.85, 0.9, 1.0) * star * (0.4 + 0.6 * hash13(cell + 7.0)) * uStars * smoothstep(0.02, 0.25, dir.y);
      }

      // the moon, drawn with tonight's real phase
      if (uMoonVis > 0.0) {
        float r = 0.016;
        vec3 right = normalize(cross(uMoonDir, vec3(0.0, 1.0, 0.0)));
        vec3 up = cross(right, uMoonDir);
        vec2 uv = vec2(dot(dir, right), dot(dir, up)) / r;
        float md = dot(dir, uMoonDir);
        col += vec3(0.75, 0.82, 1.0) * pow(max(md, 0.0), 900.0) * 0.35 * uMoonVis;
        if (md > 0.0 && dot(uv, uv) < 1.0) {
          vec3 n = vec3(uv, sqrt(1.0 - dot(uv, uv)));
          float a = uMoonPhase * 6.28318;
          vec3 L = vec3(sin(a), 0.0, -cos(a));
          float lit = smoothstep(-0.06, 0.06, dot(n, L));
          float edge = smoothstep(1.0, 0.92, dot(uv, uv));
          vec3 moon = mix(vec3(0.06, 0.07, 0.1), vec3(1.0, 0.97, 0.9) * (0.92 + 0.08 * hash13(floor(vec3(uv * 9.0, 1.0)))), lit);
          col = mix(col, moon, edge * uMoonVis);
        }
      }
    }
    return col;
  }
`

function Sky({ uniforms }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms,
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vDir;
          ${SKY_GLSL}
          void main() {
            gl_FragColor = vec4(skyColor(normalize(vDir), true), 1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    [uniforms],
  )
  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[480, 32, 16]} />
    </mesh>
  )
}

function Ocean({ segments, animate, uniforms }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: /* glsl */ `
          uniform float uTime;
          varying vec3 vWorld;
          varying vec3 vNormal;

          // Gerstner wave: direction, steepness, wavelength
          void wave(vec2 dir, float steep, float len, vec3 p, inout vec3 offs, inout vec3 n) {
            float k = 6.28318 / len;
            float c = sqrt(9.8 / k);
            vec2 d = normalize(dir);
            float f = k * (dot(d, p.xz) - c * uTime * 0.55);
            float a = steep / k;
            offs += vec3(d.x * a * cos(f), a * sin(f), d.y * a * cos(f));
            n += vec3(-d.x * steep * cos(f), -steep * sin(f), -d.y * steep * cos(f));
          }

          void main() {
            vec3 p = (modelMatrix * vec4(position, 1.0)).xyz;
            vec3 offs = vec3(0.0);
            vec3 n = vec3(0.0, 1.0, 0.0);
            wave(vec2(0.3, 1.0),  0.16, 22.0, p, offs, n);
            wave(vec2(-0.6, 0.9), 0.12, 13.0, p, offs, n);
            wave(vec2(0.8, 0.6),  0.10, 7.5,  p, offs, n);
            wave(vec2(-0.2, 1.0), 0.07, 4.2,  p, offs, n);
            p += offs;
            vWorld = p;
            vNormal = normalize(n);
            gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uFogColor;
          uniform vec3 uDeep;
          uniform vec3 uShallow;
          varying vec3 vWorld;
          varying vec3 vNormal;
          ${SKY_GLSL}

          void main() {
            vec2 q = vWorld.xz;
            vec3 ripple = vec3(
              sin(q.x * 1.7 + uTime * 1.3) * 0.5 + sin(q.x * 3.1 - q.y * 2.3 + uTime * 2.1) * 0.35,
              0.0,
              cos(q.y * 1.9 - uTime * 1.1) * 0.5 + cos(q.y * 3.7 + q.x * 1.3 + uTime * 1.7) * 0.35
            ) * 0.16;
            vec3 N = normalize(vNormal + ripple);
            vec3 V = normalize(cameraPosition - vWorld);
            vec3 R = reflect(-V, N);
            R.y = abs(R.y);

            float fres = 0.02 + 0.98 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
            float crest = smoothstep(-0.4, 1.4, vWorld.y);
            vec3 water = mix(uDeep, uShallow, crest);
            vec3 col = mix(water, skyColor(R, false) * 0.85, clamp(fres, 0.0, 1.0));

            // glitter path under the sun, or under the moon at night
            float sunUp = smoothstep(-0.02, 0.02, uSunDir.y);
            float s = max(dot(R, uSunDir), 0.0);
            col += vec3(1.0, 0.8, 0.52) * pow(s, 300.0) * 9.0 * sunUp;
            col += vec3(1.0, 0.62, 0.3) * pow(s, 30.0) * 0.35 * sunUp * uGlow;
            float full = 1.0 - abs(uMoonPhase - 0.5) * 2.0;
            float m = max(dot(R, uMoonDir), 0.0);
            col += vec3(0.8, 0.86, 1.0) * pow(m, 400.0) * 5.0 * uMoonVis * (0.25 + 0.75 * full);

            float dist = length(vWorld.xz - cameraPosition.xz);
            float fog = smoothstep(40.0, 230.0, dist);
            col = mix(col, uFogColor, fog * 0.9);

            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      }),
    [uniforms],
  )

  useFrame((_, delta) => {
    if (animate) uniforms.uTime.value += Math.min(delta, 0.05)
  })

  return (
    <mesh material={material} rotation-x={-Math.PI / 2} position={[0, 0, -90]}>
      <planeGeometry args={[420, 260, segments, segments]} />
    </mesh>
  )
}

// Sindhudurg Fort on its island — long crenellated walls, round bastions and
// coconut palms. Lit by day, a silhouette at dusk.
function Fort({ material }) {
  const { walls, palms } = useMemo(() => {
    const W = 34
    const walls = []
    walls.push({ type: 'box', pos: [0, 2.2, 0], size: [W, 4.4, 0.8] })
    for (let x = -W / 2 + 0.6; x <= W / 2; x += 1.5) walls.push({ type: 'box', pos: [x, 4.75, 0], size: [0.75, 0.7, 0.8] })
    ;[-17, -10, -3, 4, 11, 17].forEach((x, i) => {
      const h = i % 2 ? 5.4 : 6.2
      walls.push({ type: 'cyl', pos: [x, h / 2, 0.5], r: i % 2 ? 1.6 : 2.0, h })
      for (let a = 0; a < 6; a++) {
        const ang = (a / 6) * Math.PI
        walls.push({ type: 'box', pos: [x + Math.cos(ang) * 1.6, h + 0.3, 0.5 + Math.sin(ang) * 0.6], size: [0.6, 0.6, 0.6] })
      }
    })
    const palms = []
    for (let i = 0; i < 16; i++) {
      const x = -15 + i * 2 + Math.sin(i * 5.1) * 0.7
      const h = 7 + Math.abs(Math.sin(i * 2.7)) * 3.5
      palms.push({ x, h, lean: Math.sin(i * 1.9) * 0.18 })
    }
    return { walls, palms }
  }, [])

  return (
    <group position={[-7, -0.3, -150]} scale={0.62}>
      <mesh material={material} position={[0, 0.3, -1.5]} scale={[22, 1.2, 6]}>
        <sphereGeometry args={[1, 24, 12]} />
      </mesh>
      {walls.map((w, i) =>
        w.type === 'box' ? (
          <mesh key={i} material={material} position={w.pos}>
            <boxGeometry args={w.size} />
          </mesh>
        ) : (
          <mesh key={i} material={material} position={w.pos}>
            <cylinderGeometry args={[w.r * 0.92, w.r, w.h, 20]} />
          </mesh>
        ),
      )}
      {palms.map((p, i) => (
        <group key={i} position={[p.x, 0, -2.5]} rotation-z={p.lean}>
          <mesh material={material} position={[0, p.h / 2, 0]}>
            <cylinderGeometry args={[0.12, 0.2, p.h, 6]} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <mesh key={k} material={material} position={[0, p.h, 0]} rotation={[0, (k / 6) * Math.PI * 2, 0.9]}>
              <boxGeometry args={[0.18, 2.6, 0.5]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** Pushes the sun, moon and palette for `date` into the shared uniforms. */
function TimeOfDay({ date, appearance, uniforms, fortMaterial }) {
  const { scene, invalidate, size } = useThree()
  const portrait = size.width < size.height
  useEffect(() => {
    const light = appearance === 'light'
    const { elevation, azimuth } = light ? LIGHT_SUN : sunPosition(date)
    const p = light
      ? Object.fromEntries(Object.entries(LIGHT).map(([k, v]) => [k, typeof v === 'string' ? hex(v) : v]))
      : paletteFor(elevation)
    const u = uniforms
    u.uSunDir.value.copy(sunDirection(elevation, azimuth))
    u.uTop.value.copy(p.top)
    u.uMid.value.copy(p.mid)
    u.uRose.value.copy(p.rose)
    u.uHorizon.value.copy(p.horizon)
    u.uDeep.value.copy(p.deep)
    u.uShallow.value.copy(p.shallow)
    u.uFogColor.value.copy(p.fog)
    u.uStars.value = p.stars
    u.uGlow.value = p.glow
    fortMaterial.color.copy(p.fort)

    const { phase, illumination } = moonPhase(date)
    u.uMoonPhase.value = phase
    u.uMoonVis.value = !light && illumination > 0.04 ? Math.min(1, Math.max(0, (-elevation - 2) / 8)) : 0
    // The moon sits in the open sky beside the fort; low and to the right of the fort on tall phone screens.
    const mEl = THREE.MathUtils.degToRad(portrait ? 3.5 : 15)
    const mOff = THREE.MathUtils.degToRad(portrait ? 4.2 : 0.5)
    u.uMoonDir.value.set(Math.sin(mOff) * Math.cos(mEl), Math.sin(mEl), -Math.cos(mOff) * Math.cos(mEl)).normalize()

    if (scene.fog) scene.fog.color.copy(p.fog)
    invalidate()
  }, [date, appearance, uniforms, fortMaterial, scene, invalidate, portrait])
  return null
}

const reduceDip = (scroll) => Math.min(1, Math.max(0, scroll?.get?.() ?? 0))

// focusX / focusY (0–1) say where on screen the fort and horizon should sit,
// so the page layout can keep them in open space between text blocks.
function CameraRig({ animate, focusX, focusY, scroll }) {
  const { camera, pointer, invalidate, size } = useThree()
  const t = useRef(0)
  const aim = (x, y) => {
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const halfW = halfH * camera.aspect
    const shift = (focusX - 0.5) * 2 * halfW * 74
    const lift = (focusY - 0.5) * 2 * halfH * 74
    camera.position.x = x
    camera.position.y = y
    camera.lookAt(x * 0.3 - shift, y + lift, -60)
  }
  useEffect(() => {
    aim(camera.position.x, camera.position.y)
    invalidate()
  }, [focusX, focusY, size.width, size.height])
  useFrame((_, delta) => {
    if (!animate) return
    t.current += delta
    const tx = pointer.x * 1.4
    // Scrolling away from the hero lowers the camera towards the waves.
    const dip = reduceDip(scroll)
    const ty = 3.1 - dip * 2 + pointer.y * 0.5 + Math.sin(t.current * 0.35) * 0.12
    aim(camera.position.x + (tx - camera.position.x) * 0.03, camera.position.y + (ty - camera.position.y) * 0.03)
  })
  return null
}

export default function OceanScene({ animate = true, quality = 'high', focusX = 0.5, focusY = 0.5, date, appearance = 'live', scroll, onReady }) {
  const segments = quality === 'high' ? 220 : 120
  const uniforms = useMemo(makeUniforms, [])
  const fortMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#2a1f30', fog: false }), [])

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, quality === 'high' ? 1.75 : 1.25]}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      camera={{ fov: 52, near: 0.1, far: 1000, position: [0, 3.1, 14] }}
      onCreated={({ camera, scene, gl }) => {
        camera.lookAt(0, 2.2, -60)
        scene.fog = new THREE.Fog('#f2a35e', 90, 260)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
        onReady?.()
      }}
      aria-hidden="true"
    >
      <TimeOfDay date={date} appearance={appearance} uniforms={uniforms} fortMaterial={fortMaterial} />
      <Sky uniforms={uniforms} />
      <Fort material={fortMaterial} />
      <Ocean segments={segments} animate={animate} uniforms={uniforms} />
      <CameraRig animate={animate} focusX={focusX} focusY={focusY} scroll={scroll} />
    </Canvas>
  )
}
