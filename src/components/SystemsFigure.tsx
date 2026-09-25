// An original, static vector study of the three disciplines in the CV.
// Decorative geometry carries no claims about deployed systems or live status.
export function SystemsFigure() {
  return (
    <figure className="systems-figure" aria-label="Three connected disciplines: language, learning, and autonomy">
      <div className="figure-heading mono"><span>ENGINEERING FOCUS</span><span>[ 03 ]</span></div>
      <svg viewBox="0 0 360 360" fill="none" aria-hidden="true" className="systems-drawing">
        <defs>
          <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.65" fill="currentColor" opacity=".28" /></pattern>
        </defs>
        <rect x="0" y="0" width="360" height="360" fill="url(#dot-grid)" />
        <g className="drawing-guides" strokeWidth=".8">
          <path d="M180 16v328M16 180h328" strokeDasharray="3 7" />
          <circle cx="180" cy="180" r="133" />
          <path d="M12 32V12h20M328 12h20v20M12 328v20h20M328 348h20v-20" />
        </g>
        <g className="drawing-orbits" strokeWidth="1">
          <ellipse cx="180" cy="180" rx="64" ry="133" transform="rotate(-35 180 180)" />
          <ellipse cx="180" cy="180" rx="64" ry="133" transform="rotate(35 180 180)" />
          <ellipse cx="180" cy="180" rx="133" ry="51" />
        </g>
        <g className="drawing-core" strokeWidth="1">
          <path d="m180 153 24 14v27l-24 14-24-14v-27Z" />
          <path d="m156 167 24 14 24-14m-24 14v27m0-55v28" />
          <circle cx="180" cy="180" r="40" strokeDasharray="1 6" />
        </g>
        <g className="drawing-nodes"><circle cx="104" cy="76" r="4" /><circle cx="288" cy="258" r="4" /><circle cx="50" cy="191" r="4" /></g>
        <g className="drawing-labels"><text x="114" y="69">LANGUAGE</text><text x="212" y="286">AUTONOMY</text><text x="22" y="219">LEARNING</text></g>
        <path d="M173 21h14m-7-7v14M173 339h14m-7-7v14" className="drawing-guides" />
      </svg>
      <figcaption className="mono"><span>APPLIED AI + ROBOTICS</span><span>FIG. 01</span></figcaption>
    </figure>
  )
}
