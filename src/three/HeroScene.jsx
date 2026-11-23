// WebGL hero: a floating microchip whose circuit traces fire data pulses outward,
// with a particle field, orbit rings, cursor-reactive lighting and scroll-driven camera.
// Loaded lazily (after first interaction / idle) so it never blocks first paint.

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { generateCircuit, mulberry32 } from '../lib/circuit.js'

gsap.registerPlugin(ScrollTrigger)

const TRACE_HALF_WIDTH = 0.0085
const BOARD = 4.2 // world radius of the circuit board (normalised coords × BOARD)
const BLUE = new THREE.Vector3(0.357, 0.549, 1.0)
const VIOLET = new THREE.Vector3(0.635, 0.455, 1.0)

// ---------------------------------------------------------------- shaders
const traceVert = /* glsl */ `
  attribute float aDist;
  attribute float aSeed;
  attribute float aSide;
  varying float vDist;
  varying float vSeed;
  varying float vSide;
  varying vec3 vLocal;
  void main() {
    vDist = aDist;
    vSeed = aSeed;
    vSide = aSide;
    vLocal = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const traceFrag = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uPointer;
  uniform float uPointerOn;
  varying float vDist;
  varying float vSeed;
  varying float vSide;
  varying vec3 vLocal;
  void main() {
    if (vDist > uReveal) discard;
    float speed = 0.22 + vSeed * 0.25;
    float head = fract(uTime * speed + vSeed * 7.0);
    float d = vDist - head;
    float tail = smoothstep(-0.22, 0.0, d) * (1.0 - smoothstep(0.0, 0.012, d));
    float r = length(vLocal.xz);
    float fade = 1.0 - smoothstep(2.8, ${BOARD.toFixed(1)}, r);
    float hover = uPointerOn * (1.0 - smoothstep(0.0, 1.5, distance(vLocal.xz, uPointer.xz)));
    vec3 base = mix(uA, uB, vSeed);
    float edge = 1.0 - smoothstep(0.45, 1.0, abs(vSide));
    float tip = smoothstep(0.0, 0.06, vDist);
    vec3 col = base * (0.95 + hover * 1.1) + vec3(0.85, 0.92, 1.0) * tail * 1.5;
    float a = ((0.34 + hover * 0.7) * tip + tail * 1.3) * fade * edge;
    gl_FragColor = vec4(col, a);
  }
`
const pointVert = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (6.0 / -mv.z);
  }
`
const pointFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vAlpha);
  }
`
const viaVert = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReveal;
  attribute float aSeed;
  varying float vGlow;
  void main() {
    float speed = 0.22 + aSeed * 0.25;
    float head = fract(uTime * speed + aSeed * 7.0);
    vGlow = smoothstep(0.86, 1.0, head) * step(0.999, uReveal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (9.0 + vGlow * 10.0) * uPixelRatio * (6.0 / -mv.z);
  }
`
const viaFrag = /* glsl */ `
  uniform vec3 uA;
  uniform float uReveal;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float ring = smoothstep(0.5, 0.38, d) * smoothstep(0.22, 0.32, d);
    float core = smoothstep(0.35, 0.0, d) * vGlow;
    vec3 col = uA * (0.7 + vGlow) + vec3(0.9, 0.95, 1.0) * core;
    gl_FragColor = vec4(col, (ring * 0.95 + core) * uReveal);
  }
`
const particleVert = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;
  attribute float aScale;
  attribute float aSpeed;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * aSpeed, 3.4) - 0.3;
    float ang = uTime * 0.02 * (0.5 + aSpeed * 3.0);
    float c = cos(ang), s = sin(ang);
    p.xz = mat2(c, -s, s, c) * p.xz;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio * (24.0 / -mv.z);
    float edge = smoothstep(-0.3, 0.4, p.y) * (1.0 - smoothstep(2.4, 3.1, p.y));
    float tw = 0.55 + 0.45 * sin(uTime * 1.3 + position.x * 9.0 + position.z * 5.0);
    vAlpha = edge * tw * uOpacity;
    vColor = aColor;
  }
`
const particleFrag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`
const dieFrag = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 uv = vUv;
    vec2 g = uv * 14.0;
    vec2 id = floor(g);
    vec2 f = fract(g);
    float h = hash(id);
    float wave = sin(uTime * 1.6 - length(id - 6.5) * 0.6 + h * 2.0) * 0.5 + 0.5;
    float on = smoothstep(0.55, 1.0, wave) * step(0.3, h);
    float cell = step(0.15, f.x) * step(0.15, f.y) * step(f.x, 0.85) * step(f.y, 0.85);
    vec3 a = vec3(0.36, 0.55, 1.0);
    vec3 b = vec3(0.66, 0.47, 1.0);
    vec3 col = mix(a, b, uv.x * 0.6 + uv.y * 0.4);
    float center = 1.0 - smoothstep(0.0, 0.75, length(uv - 0.5) * 1.4);
    vec3 c = vec3(0.03, 0.035, 0.06) + col * cell * (0.2 + on * 1.1) + col * center * 0.35;
    float edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    c += col * (1.0 - smoothstep(0.0, 0.02, edge)) * 0.95;
    float scan = (1.0 - smoothstep(0.0, 0.025, abs(fract(uTime * 0.22) - uv.y))) * 0.7;
    c += col * scan * cell;
    gl_FragColor = vec4(c * uIntensity, 1.0);
  }
`
const basicVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const groundFrag = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * 12.0;
    float r = length(p);
    vec2 g = abs(fract(p * 1.25) - 0.5);
    float line = 1.0 - smoothstep(0.0, 0.025, min(g.x, g.y));
    float fade = 1.0 - smoothstep(1.2, 5.2, r);
    float shadow = 1.0 - smoothstep(0.4, 1.7, r);
    vec3 col = vec3(0.4, 0.48, 1.0) * line * 0.5;
    float a = (line * 0.16 * fade + shadow * 0.55) * uOpacity;
    gl_FragColor = vec4(col * (1.0 - shadow), a);
  }
`

// ---------------------------------------------------------------- helpers
function useCircuit(pinsPerSide) {
  return useMemo(() => {
    const traces = generateCircuit({ pinsPerSide, half: 0.2, seed: 7 })
    const rand = mulberry32(99)
    const pos = []
    const dist = []
    const side = []
    const seed = []
    const ends = []
    const endSeed = []
    const pins = []
    const paths = []
    traces.forEach((tr, idx) => {
      const s = rand()
      const pts = tr.points.map(([x, y]) => [x * BOARD, y * BOARD])
      const cum = [0]
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
      const len = cum[cum.length - 1]
      for (let i = 1; i < pts.length; i++) {
        // ribbon quad (two triangles) so traces keep a visible width at any DPR
        const [x0, z0] = pts[i - 1]
        const [x1, z1] = pts[i]
        const segLen = Math.hypot(x1 - x0, z1 - z0) || 1
        const nx = (-(z1 - z0) / segLen) * TRACE_HALF_WIDTH
        const nz = ((x1 - x0) / segLen) * TRACE_HALF_WIDTH
        const d0 = cum[i - 1] / len
        const d1 = cum[i] / len
        pos.push(x0 + nx, 0, z0 + nz, x0 - nx, 0, z0 - nz, x1 + nx, 0, z1 + nz, x0 - nx, 0, z0 - nz, x1 - nx, 0, z1 - nz, x1 + nx, 0, z1 + nz)
        dist.push(d0, d0, d1, d0, d1, d1)
        side.push(1, -1, 1, -1, -1, 1)
        seed.push(s, s, s, s, s, s)
      }
      const last = pts[pts.length - 1]
      ends.push(last[0], 0, last[1])
      endSeed.push(s)
      const sideIndex = Math.floor(idx / pinsPerSide) // 0 E, 1 S, 2 W, 3 N
      pins.push({ x: pts[0][0], z: pts[0][1], horizontal: sideIndex % 2 === 0 })
      paths.push({ pts, cum, len, seed: s })
    })

    const traceGeo = new THREE.BufferGeometry()
    traceGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    traceGeo.setAttribute('aDist', new THREE.Float32BufferAttribute(dist, 1))
    traceGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1))
    traceGeo.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1))

    const viaGeo = new THREE.BufferGeometry()
    viaGeo.setAttribute('position', new THREE.Float32BufferAttribute(ends, 3))
    viaGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(endSeed, 1))

    const headGeo = new THREE.BufferGeometry()
    headGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(paths.length * 3), 3))
    headGeo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(paths.length), 1))

    return { traceGeo, viaGeo, headGeo, pins, paths }
  }, [pinsPerSide])
}

function useParticles(count) {
  return useMemo(() => {
    const rand = mulberry32(3)
    const pos = new Float32Array(count * 3)
    const scale = new Float32Array(count)
    const speed = new Float32Array(count)
    const color = new Float32Array(count * 3)
    const palette = [
      [0.42, 0.6, 1.0],
      [0.66, 0.5, 1.0],
      [0.8, 0.86, 1.0],
      [0.3, 0.85, 1.0],
    ]
    for (let i = 0; i < count; i++) {
      const r = 0.6 + Math.pow(rand(), 0.7) * 5.2
      const a = rand() * Math.PI * 2
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = rand() * 3.4
      pos[i * 3 + 2] = Math.sin(a) * r
      scale[i] = 0.6 + rand() * 1.8
      speed[i] = 0.03 + rand() * 0.09
      const c = palette[Math.floor(rand() * palette.length)]
      color.set(c, i * 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))
    geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3))
    return geo
  }, [count])
}

const tmp = new THREE.Object3D()
const ray = new THREE.Raycaster()
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const hit = new THREE.Vector3()
const ndc = new THREE.Vector2()

// ---------------------------------------------------------------- scene
function Chip({ tier, pointerRef, heroEl, onFirstFrame }) {
  const high = tier === 'high'
  const pinsPerSide = high ? 12 : 8
  const { traceGeo, viaGeo, headGeo, pins, paths } = useCircuit(pinsPerSide)
  const particleGeo = useParticles(high ? 900 : 380)
  const { camera, size, gl } = useThree()

  const root = useRef()
  const chip = useRef()
  const pinMesh = useRef()
  const light = useRef()
  const rings = useRef()
  const orbitGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * 3), 3))
    g.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(6).fill(1), 1))
    return g
  }, [])

  const chipGeo = useMemo(() => new RoundedBoxGeometry(1.72, 0.22, 1.72, 4, 0.07), [])
  const perf = useRef({ frames: 0, time: 0, lowered: false })
  const setDpr = useThree((s) => s.setDpr)

  const state = useRef({ reveal: 0, chipY: 1.4, intensity: 0, opacity: 0, dolly: 1.8, scroll: 0, first: true })
  const smooth = useRef({ x: 0, y: 0 })
  const local = useMemo(() => new THREE.Vector3(), [])
  const pr = Math.min(gl.getPixelRatio(), 2)

  const uniforms = useMemo(
    () => ({
      trace: {
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uA: { value: BLUE },
        uB: { value: VIOLET },
        uPointer: { value: new THREE.Vector3(99, 0, 99) },
        uPointerOn: { value: 0 },
      },
      via: { uTime: { value: 0 }, uPixelRatio: { value: pr }, uReveal: { value: 0 }, uA: { value: BLUE } },
      head: { uSize: { value: 24 }, uPixelRatio: { value: pr }, uColor: { value: new THREE.Vector3(0.82, 0.9, 1.0) } },
      orbit: { uSize: { value: 12 }, uPixelRatio: { value: pr }, uColor: { value: new THREE.Vector3(0.75, 0.7, 1.0) } },
      particles: { uTime: { value: 0 }, uPixelRatio: { value: pr }, uOpacity: { value: 0 } },
      die: { uTime: { value: 0 }, uIntensity: { value: 0 } },
      ground: { uOpacity: { value: 0 } },
    }),
    // created once: three.js caches the uniforms object at compile time, so it must never be replaced
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Materials are built directly (not via JSX props) so they reference the uniform objects above;
  // R3F copies a `uniforms` prop, which would detach per-frame updates from the GPU.
  const materials = useMemo(() => {
    const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }
    return {
      ground: new THREE.ShaderMaterial({
        vertexShader: basicVert,
        fragmentShader: groundFrag,
        uniforms: uniforms.ground,
        transparent: true,
        depthWrite: false,
      }),
      trace: new THREE.ShaderMaterial({ vertexShader: traceVert, fragmentShader: traceFrag, uniforms: uniforms.trace, side: THREE.DoubleSide, ...additive }),
      via: new THREE.ShaderMaterial({ vertexShader: viaVert, fragmentShader: viaFrag, uniforms: uniforms.via, ...additive }),
      head: new THREE.ShaderMaterial({ vertexShader: pointVert, fragmentShader: pointFrag, uniforms: uniforms.head, ...additive }),
      orbit: new THREE.ShaderMaterial({ vertexShader: pointVert, fragmentShader: pointFrag, uniforms: uniforms.orbit, ...additive }),
      particles: new THREE.ShaderMaterial({ vertexShader: particleVert, fragmentShader: particleFrag, uniforms: uniforms.particles, ...additive }),
      die: new THREE.ShaderMaterial({ vertexShader: basicVert, fragmentShader: dieFrag, uniforms: uniforms.die }),
    }
  }, [uniforms])
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials])

  // Pins (instanced)
  useLayoutEffect(() => {
    const mesh = pinMesh.current
    if (!mesh) return
    pins.forEach((p, i) => {
      tmp.position.set(p.x * 0.985, -0.02, p.z * 0.985)
      tmp.rotation.set(0, p.horizontal ? Math.PI / 2 : 0, 0)
      tmp.updateMatrix()
      mesh.setMatrixAt(i, tmp.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [pins])

  // Composition: push the chip right on wide screens, up on tall screens.
  useLayoutEffect(() => {
    const wide = size.width / size.height > 1.05
    const scale = wide ? THREE.MathUtils.clamp(size.width / 1550, 0.66, 1) : 0.72
    camera.setViewOffset(size.width, size.height, wide ? -size.width * 0.205 : 0, wide ? size.height * 0.03 : size.height * 0.2, size.width, size.height)
    camera.updateProjectionMatrix()
    if (root.current) root.current.scale.setScalar(scale)
    return () => camera.clearViewOffset()
  }, [camera, size])

  // Intro timeline + scroll-driven camera (GSAP)
  useEffect(() => {
    const s = state.current
    const tl = gsap.timeline()
    tl.to(s, { chipY: 0.16, duration: 1.8, ease: 'expo.out' }, 0)
      .to(s, { intensity: 1, duration: 1.6, ease: 'power2.out' }, 0.25)
      .to(s, { reveal: 1, duration: 2.6, ease: 'power2.inOut' }, 0.35)
      .to(s, { opacity: 1, duration: 2, ease: 'power1.out' }, 0.2)
      .to(s, { dolly: 0, duration: 2.6, ease: 'expo.out' }, 0)
    const st = heroEl ? gsap.to(s, { scroll: 1, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.8 } }) : null
    return () => {
      tl.kill()
      st?.scrollTrigger?.kill()
      st?.kill()
    }
  }, [heroEl])

  useFrame((frame, delta) => {
    const t = frame.clock.elapsedTime
    const s = state.current
    const dt = Math.min(delta, 0.05)

    // smoothed pointer (-1..1)
    const p = pointerRef.current
    smooth.current.x += (p.x - smooth.current.x) * Math.min(1, dt * 3)
    smooth.current.y += (p.y - smooth.current.y) * Math.min(1, dt * 3)
    const sx = smooth.current.x
    const sy = smooth.current.y

    // camera: intro dolly + scroll choreography
    const sc = s.scroll
    camera.position.set(sx * 0.3, 4.5 + sc * 3.2 + s.dolly * 0.6, 7.0 - sc * 3.0 + s.dolly)
    camera.lookAt(0, 0.1 - sc * 0.4, 0)

    // root group: idle spin + pointer tilt
    const g = root.current
    if (g) {
      g.rotation.y = -0.55 + Math.sin(t * 0.12) * 0.12 + sx * 0.32 + sc * 0.9
      g.rotation.x = sy * 0.07
    }
    if (chip.current) chip.current.position.y = s.chipY + Math.sin(t * 1.3) * 0.035

    // pointer → board plane (local space) for the hover glow and the moving light
    if (g && p.active) {
      ndc.set(p.x, p.y)
      ray.setFromCamera(ndc, camera)
      if (ray.ray.intersectPlane(plane, hit)) {
        local.copy(hit)
        g.worldToLocal(local)
        uniforms.trace.uPointer.value.lerp(local, Math.min(1, dt * 8))
        if (light.current) light.current.position.set(hit.x, 1.1, hit.z)
      }
      uniforms.trace.uPointerOn.value += (1 - uniforms.trace.uPointerOn.value) * Math.min(1, dt * 4)
    } else {
      uniforms.trace.uPointerOn.value *= 1 - Math.min(1, dt * 2)
    }

    // shader time + intro values
    uniforms.trace.uTime.value = t
    uniforms.trace.uReveal.value = s.reveal
    uniforms.via.uTime.value = t
    uniforms.via.uReveal.value = s.reveal
    uniforms.particles.uTime.value = t
    uniforms.particles.uOpacity.value = s.opacity
    uniforms.die.uTime.value = t
    uniforms.die.uIntensity.value = s.intensity
    uniforms.ground.uOpacity.value = s.opacity

    // pulse heads (CPU interpolation along each polyline)
    const hp = headGeo.attributes.position.array
    const ha = headGeo.attributes.aAlpha.array
    for (let i = 0; i < paths.length; i++) {
      const { pts, cum, len, seed } = paths[i]
      const head = (t * (0.22 + seed * 0.25) + seed * 7) % 1
      if (head > s.reveal) {
        ha[i] = 0
        continue
      }
      const d = head * len
      let k = 1
      while (k < cum.length - 1 && cum[k] < d) k++
      const f = (d - cum[k - 1]) / (cum[k] - cum[k - 1] || 1)
      hp[i * 3] = pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * f
      hp[i * 3 + 1] = 0.01
      hp[i * 3 + 2] = pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * f
      ha[i] = Math.min(1, head * 12) * (1 - Math.max(0, (Math.hypot(hp[i * 3], hp[i * 3 + 2]) - 2.8) / 1.4))
    }
    headGeo.attributes.position.needsUpdate = true
    headGeo.attributes.aAlpha.needsUpdate = true

    // orbit rings + orbiters
    if (rings.current) {
      rings.current.rotation.y = t * 0.08
      const op = orbitGeo.attributes.position.array
      for (let i = 0; i < 6; i++) {
        const r = i < 3 ? 1.75 : 2.3
        const a = t * (i < 3 ? 0.5 : -0.32) + (i % 3) * ((Math.PI * 2) / 3)
        op[i * 3] = Math.cos(a) * r
        op[i * 3 + 1] = 0
        op[i * 3 + 2] = Math.sin(a) * r
      }
      orbitGeo.attributes.position.needsUpdate = true
    }

    // keep point sprites crisp if the DPR changes
    const ratio = Math.min(gl.getPixelRatio(), 2)
    uniforms.via.uPixelRatio.value = ratio
    uniforms.head.uPixelRatio.value = ratio
    uniforms.orbit.uPixelRatio.value = ratio
    uniforms.particles.uPixelRatio.value = ratio

    // adaptive quality: drop to DPR 1 if the average frame rate stays low after the intro
    const pm = perf.current
    if (!pm.lowered && t > 3) {
      pm.frames++
      pm.time += delta
      if (pm.time > 2) {
        if (pm.frames / pm.time < 42 && gl.getPixelRatio() > 1) {
          setDpr(1)
          pm.lowered = true
        }
        pm.frames = 0
        pm.time = 0
      }
    }

    if (s.first) {
      s.first = false
      onFirstFrame?.()
    }
  })

  return (
    <group ref={root}>
      {/* ground: faint grid + soft contact shadow */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.08} renderOrder={-1}>
        <planeGeometry args={[12, 12]} />
        <primitive object={materials.ground} attach="material" />
      </mesh>

      {/* circuit traces, vias and travelling pulses */}
      <mesh geometry={traceGeo}>
        <primitive object={materials.trace} attach="material" />
      </mesh>
      <points geometry={viaGeo}>
        <primitive object={materials.via} attach="material" />
      </points>
      <points geometry={headGeo}>
        <primitive object={materials.head} attach="material" />
      </points>

      {/* the chip */}
      <group ref={chip} position-y={1.4}>
        <mesh geometry={chipGeo}>
          <meshStandardMaterial color="#121521" metalness={0.65} roughness={0.32} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={0.1105}>
          <planeGeometry args={[1.08, 1.08]} />
          <primitive object={materials.die} attach="material" />
        </mesh>
        <instancedMesh ref={pinMesh} args={[undefined, undefined, pins.length]}>
          <boxGeometry args={[0.05, 0.035, 0.2]} />
          <meshStandardMaterial color="#a8b0cc" metalness={0.9} roughness={0.25} />
        </instancedMesh>
      </group>

      {/* orbit rings */}
      {high && (
        <group ref={rings} position-y={0.35} rotation-x={0.12}>
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[1.75, 0.0045, 6, 180]} />
            <meshBasicMaterial color="#7f90ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[2.3, 0.0035, 6, 200]} />
            <meshBasicMaterial color="#a98bff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <points geometry={orbitGeo}>
            <primitive object={materials.orbit} attach="material" />
          </points>
        </group>
      )}

      {/* particle field */}
      <points geometry={particleGeo}>
        <primitive object={materials.particles} attach="material" />
      </points>

      {/* lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 4]} intensity={1.6} color="#a9bcff" />
      <directionalLight position={[-4, 2.5, -3]} intensity={1.1} color="#b48cff" />
      <pointLight ref={light} position={[1.5, 1.1, 1.5]} intensity={high ? 9 : 0} distance={4.5} decay={1.6} color="#8fa0ff" />
    </group>
  )
}

export default function HeroScene({ tier = 'high', active = true, heroEl, onReady }) {
  const maxDpr = tier === 'high' ? 1.75 : 1.25
  const pointer = useRef({ x: 0, y: 0, active: false })
  const wrap = useRef(null)

  // Track the pointer over the whole hero (the canvas itself sits behind the content).
  useEffect(() => {
    if (tier !== 'high' || !heroEl) return
    let rect = heroEl.getBoundingClientRect()
    const updateRect = () => (rect = heroEl.getBoundingClientRect())
    const onMove = (e) => {
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      pointer.current.active = true
    }
    const onLeave = () => {
      pointer.current.active = false
      pointer.current.x = 0
      pointer.current.y = 0
    }
    heroEl.addEventListener('pointermove', onMove, { passive: true })
    heroEl.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, { passive: true })
    return () => {
      heroEl.removeEventListener('pointermove', onMove)
      heroEl.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [tier, heroEl])

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        flat
        dpr={[1, maxDpr]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 3.5, 9.4], fov: 32, near: 0.1, far: 60 }}
        gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance', stencil: false }}
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <Chip tier={tier} pointerRef={pointer} heroEl={heroEl} onFirstFrame={onReady} />
      </Canvas>
    </div>
  )
}
