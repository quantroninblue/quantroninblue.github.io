import type { ArtifactId } from './artifacts'

function Assembly({ amount }: { amount: number }) {
  const lift = amount * .65
  return <svg viewBox="0 0 480 340" fill="none" aria-hidden="true" className="artifact-drawing assembly-drawing">
    <g className="drawing-construction"><path d="m75 272 174-100 158 91-174 100Z" /><path d="M240 42v269M60 205l346 0M103 117l294 170" strokeDasharray="3 7" />
      <path d="m102 283 123 71m-125-77 1 12m119 60 10 3" /></g>
    <g className="assembly-part" style={{ transform: `translateY(${lift * .3}px)` }}>
      <g className="drawing-body"><ellipse cx="158" cy="251" rx="25" ry="35" transform="rotate(-27 158 251)" /><ellipse cx="170" cy="245" rx="25" ry="35" transform="rotate(-27 170 245)" /><ellipse cx="170" cy="245" rx="12" ry="20" transform="rotate(-27 170 245)" />
        <ellipse cx="330" cy="214" rx="24" ry="35" transform="rotate(-27 330 214)" /><ellipse cx="342" cy="208" rx="24" ry="35" transform="rotate(-27 342 208)" /><ellipse cx="342" cy="208" rx="11" ry="19" transform="rotate(-27 342 208)" /></g>
      <path d="m181 239 136-70" className="drawing-highlight" />
    </g>
    <g className="assembly-part" style={{ transform: `translateY(${-lift * .35}px)` }}>
      <path className="drawing-body" d="m120 207 124-72 117 67v23l-124 72-117-67Zm0 0 117 67 124-72m-124 72v23" />
      <path className="drawing-highlight" d="m139 206 104-60 98 56-104 61Zm28-1 76-44 72 41-77 44Z" />
      <path className="drawing-construction" d="m168 211 23 13m87-59 23 13m-94 71 23 13m71-70 23 13" />
    </g>
    <g className="assembly-part" style={{ transform: `translateY(${-lift}px)` }}>
      <path className="drawing-body" d="m204 166 39-22 40 23v21l-39 23-40-24Zm0 0 40 23 39-22m-39 22v22" />
      <path className="drawing-highlight" d="M224 159v-19c0-12 38-12 38 0v19c0 12-38 12-38 0Z" /><ellipse className="drawing-highlight" cx="243" cy="139" rx="19" ry="8" />
      <path className="drawing-construction" d="m264 146 52-30h49" />
    </g>
    <g className="drawing-annotation"><text x="369" y={119 - lift}>SENSOR</text><text x="49" y="309">DIFFERENTIAL DRIVE</text><text x="327" y="319">x / y / z</text></g>
  </svg>
}

const route = [[70,235], [126,214], [158,172], [168,104], [230,73], [290,104], [344,76], [393,55]]
function Navigation({ amount }: { amount: number }) {
  const t = amount / 100 * (route.length - 1)
  const index = Math.min(Math.floor(t), route.length - 2), mix = t - index
  const x = route[index][0] + (route[index + 1][0] - route[index][0]) * mix
  const y = route[index][1] + (route[index + 1][1] - route[index][1]) * mix
  const traveled = route.slice(0, index + 1).map(point => point.join(',')).join(' ') + ` ${x},${y}`
  return <svg viewBox="0 0 480 290" fill="none" aria-hidden="true" className="artifact-drawing navigation-drawing">
    <g className="drawing-construction"><path d="M42 34h395v220H42Z" />{[86,130,174,218].map(y => <path key={y} d={`M42 ${y}h395`} />)}{[86,130,174,218,262,306,350,394].map(x => <path key={x} d={`M${x} 34v220`} />)}</g>
    <g className="drawing-body"><path d="M87 50h42v90H87ZM202 126h93v43h-93ZM340 140h59v80h-59Z" /></g>
    <path className="drawing-construction" d="m70 235 162-88 161-92" strokeDasharray="4 5" />
    <path d="m206 134 14 14m0-14-14 14" className="drawing-highlight" />
    <polyline className="drawing-construction" points={route.map(point => point.join(',')).join(' ')} strokeDasharray="3 5" />
    <polyline className="drawing-highlight navigation-trace" points={traveled} />
    <g transform={`translate(${x} ${y})`}><circle r="25" className="drawing-construction" strokeDasharray="2 5" /><path d="m0-10 7 17-7-4-7 4Z" className="drawing-highlight" /></g>
    <path d="M387 49h12v12h-12Z" className="drawing-highlight" />
    <g className="drawing-annotation"><text x="45" y="278">LOCAL MAP / RECOVERY STUDY</text><text x="305" y="27">GOAL</text></g>
  </svg>
}

// Seeded value noise: deterministic, smooth interpolation across adjacent cells.
function noise(x: number, y: number, seed: number) {
  const hash = (a: number, b: number) => {
    const value = Math.sin(a * 127.1 + b * 311.7 + seed * 74.7) * 43758.5453
    return value - Math.floor(value)
  }
  const ix = Math.floor(x), iy = Math.floor(y)
  const sx = x - ix, sy = y - iy
  const u = sx * sx * (3 - 2 * sx), v = sy * sy * (3 - 2 * sy)
  return (hash(ix, iy) * (1 - u) + hash(ix + 1, iy) * u) * (1 - v) + (hash(ix, iy + 1) * (1 - u) + hash(ix + 1, iy + 1) * u) * v
}
function Surface({ amount, seed }: { amount: number; seed: number }) {
  const point = (u: number, v: number) => {
    const z = noise(u * 3, v * 3, seed) * .7 + noise(u * 7, v * 7, seed + 1) * amount / 160
    return `${55 + u * 247 + v * 117},${158 + v * 110 - u * 72 - z * 92}`
  }
  return <svg viewBox="0 0 480 290" fill="none" aria-hidden="true" className="artifact-drawing surface-drawing">
    <path className="drawing-construction" d="m55 190 117 79 247-73M55 190V57m117 212v-14m247-58v-14" />
    {Array.from({ length: 18 }, (_, row) => <polyline key={`r${row}`} className={row % 4 === 0 ? 'drawing-highlight' : 'drawing-body'} points={Array.from({ length: 29 }, (_, col) => point(col / 28, row / 17)).join(' ')} />)}
    {Array.from({ length: 22 }, (_, col) => <polyline key={`c${col}`} className="drawing-construction" points={Array.from({ length: 25 }, (_, row) => point(col / 21, row / 24)).join(' ')} />)}
    <g className="drawing-annotation"><text x="25" y="48">σ</text><text x="40" y="232">STRIKE</text><text x="341" y="243">TENOR</text></g>
  </svg>
}

export function ArtifactDrawing({ id, amount, seed = 1 }: { id: ArtifactId; amount: number; seed?: number }) {
  if (id === 'assembly') return <Assembly amount={amount} />
  if (id === 'navigation') return <Navigation amount={amount} />
  return <Surface amount={amount} seed={seed} />
}
