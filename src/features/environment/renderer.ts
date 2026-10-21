export type EnvironmentMode = 'home' | 'about' | 'projects' | 'github' | 'cv' | 'contact'
type Settings = { speed: number; amplitude: number; structure: number; opacity: number }
const modes: Record<EnvironmentMode, Settings> = {
  home: { speed: .24, amplitude: 30, structure: .12, opacity: .22 },
  about: { speed: .12, amplitude: 36, structure: 0, opacity: .20 },
  projects: { speed: .2, amplitude: 22, structure: .85, opacity: .25 },
  github: { speed: .34, amplitude: 27, structure: .65, opacity: .22 },
  cv: { speed: .06, amplitude: 8, structure: .9, opacity: .09 },
  contact: { speed: .08, amplitude: 15, structure: .15, opacity: .14 },
}

/** One bounded, deterministic height field. No particles, assets, or GPU engine. */
export function createEnvironment(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return null
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const coarse = matchMedia('(pointer: coarse)')
  let width = 0, height = 0, mobile = false, frame = 0, last = 0, time = 0
  let paused = false, disposed = false, mode: EnvironmentMode = 'home'
  let scrollEnergy = 0, lastScroll = window.scrollY, excitation = 0
  let pointerX = -1000, pointerY = -1000, impulse = 0
  let interval = 1000 / 30
  const current = { ...modes.home }
  // Reuse vertex buffers; no per-frame object allocation or React renders.
  const columns = 38, rows = 22, count = (columns + 1) * (rows + 1)
  const xs = new Float32Array(count), ys = new Float32Array(count)
  const displacement = new Float32Array(count), velocity = new Float32Array(count)

  function draw(dt: number) {
    if (!ctx) return
    const target = modes[mode]
    const smoothing = 1 - Math.exp(-dt * 2)
    for (const key of ['speed', 'amplitude', 'structure', 'opacity'] as const) current[key] += (target[key] - current[key]) * smoothing
    const still = paused || motion.matches
    if (!still) time += dt * (current.speed + scrollEnergy * .8)
    scrollEnergy *= Math.exp(-dt * 4)
    impulse *= Math.exp(-dt * 5)
    ctx.clearRect(0, 0, width, height)
    const step = mobile ? 2 : 1
    const scale = Math.min(width / 1000, 1.6)
    const span = mobile ? width * 1.65 : width * .8
    const cx = width * (mobile ? .7 : .81), cy = height * .66
    for (let row = 0; row <= rows; row += step) {
      for (let col = 0; col <= columns; col += step) {
        const i = row * (columns + 1) + col
        const u = col / columns - .5, v = row / rows - .5
        const x = cx + (u + v * .46) * span
        const baseY = cy + (v * .62 - u * .12) * span
        const smooth = Math.sin(u * 7 + time) * Math.cos(v * 6 - time * .65)
        const quantized = Math.round(smooth * 4) / 4
        const z = (smooth * (1 - current.structure) + quantized * current.structure) * current.amplitude + (u * u - v * v) * 105
        const distance = Math.hypot(x - pointerX, baseY - z * scale - pointerY)
        const force = !still && !coarse.matches ? Math.exp(-distance * distance / 24000) * (22 + excitation * 12 + impulse * 38) : 0
        if (!still) {
          // Critically damped local spring; no unbounded impulses or accumulated trails.
          velocity[i] += ((force - displacement[i]) * 35 - velocity[i] * 12) * dt
          displacement[i] += velocity[i] * dt
        }
        xs[i] = x
        ys[i] = baseY - (z + displacement[i]) * scale
      }
    }
    ctx.lineWidth = .7
    // Ordered scan across the same sheet on GitHub, rather than simulated live data.
    for (let row = 0; row <= rows; row += step) {
      const band = mode === 'github' ? Math.pow(Math.max(0, Math.cos(row * .25 - time * 2)), 12) * .12 : 0
      const fade = Math.sin(Math.PI * (row + 1) / (rows + 2))
      ctx.strokeStyle = `rgba(78,168,255,${(current.opacity + band) * fade * (mobile ? .8 : 1)})`
      ctx.beginPath()
      for (let col = 0; col <= columns; col += step) {
        const i = row * (columns + 1) + col
        if (!col) ctx.moveTo(xs[i], ys[i]); else ctx.lineTo(xs[i], ys[i])
      }
      ctx.stroke()
    }
    ctx.strokeStyle = `rgba(147,163,173,${current.opacity * .55})`
    for (let col = 0; col <= columns; col += step) {
      ctx.beginPath()
      for (let row = 0; row <= rows; row += step) {
        const i = row * (columns + 1) + col
        if (!row) ctx.moveTo(xs[i], ys[i]); else ctx.lineTo(xs[i], ys[i])
      }
      ctx.stroke()
    }
  }
  function tick(now: number) {
    frame = 0
    if (disposed || paused || motion.matches || document.hidden) return
    if (now - last >= interval) {
      const dt = Math.min((now - last) / 1000 || .033, .06)
      last = now
      const start = performance.now()
      draw(dt)
      if (performance.now() - start > 12) interval = 1000 / 20
    }
    frame = requestAnimationFrame(tick)
  }
  function resume() {
    cancelAnimationFrame(frame)
    frame = 0
    last = performance.now()
    if (!document.hidden && !paused && !motion.matches && !disposed) frame = requestAnimationFrame(tick)
  }
  function resize() {
    width = window.innerWidth; height = window.innerHeight
    mobile = width < 800 || coarse.matches
    interval = 1000 / (mobile ? 20 : 30)
    const ratio = Math.min(devicePixelRatio || 1, mobile ? 1 : 1.5)
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio)
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0)
    draw(0)
  }
  const pointer = (event: PointerEvent) => { if (!paused && !motion.matches) { pointerX = event.clientX; pointerY = event.clientY } }
  const leave = () => { pointerX = -1000; pointerY = -1000 }
  const disturb = () => { if (!paused && !motion.matches) impulse = 1 }
  const scroll = () => { scrollEnergy = Math.min(Math.abs(window.scrollY - lastScroll) / 160, 1); lastScroll = window.scrollY }
  const hover = (event: Event) => { excitation = event.target instanceof Element && event.target.closest('a,button,input,summary') ? 1 : 0 }
  const reducedChange = () => {
    if (motion.matches) { displacement.fill(0); velocity.fill(0); Object.assign(current, modes[mode]); draw(0) }
    resume()
  }
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', pointer, { passive: true })
  document.addEventListener('pointerleave', leave)
  window.addEventListener('pointerdown', disturb, { passive: true })
  window.addEventListener('scroll', scroll, { passive: true })
  document.addEventListener('pointerover', hover, { passive: true })
  document.addEventListener('focusin', hover)
  document.addEventListener('visibilitychange', resume)
  motion.addEventListener('change', reducedChange)
  coarse.addEventListener('change', resize)
  resize(); resume()
  return {
    setMode(next: EnvironmentMode) {
      mode = next
      if (paused || motion.matches) { Object.assign(current, modes[mode]); draw(0) }
    },
    setPaused(next: boolean) { paused = next; resume() },
    dispose() {
      disposed = true; cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', pointer)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', disturb)
      window.removeEventListener('scroll', scroll)
      document.removeEventListener('pointerover', hover)
      document.removeEventListener('focusin', hover)
      document.removeEventListener('visibilitychange', resume)
      motion.removeEventListener('change', reducedChange)
      coarse.removeEventListener('change', resize)
    },
  }
}
