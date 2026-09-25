import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, RotateCcw } from 'lucide-react'
import { artifacts } from './artifacts'
import type { ArtifactId } from './artifacts'
import { ArtifactDrawing } from './ArtifactDrawings'
import { githubUrl } from '../../data/profile'

const controlLabels: Record<ArtifactId, string> = { assembly: 'Assembly separation', navigation: 'Trace position', surface: 'Surface roughness' }

export function Workbench() {
  const [selected, setSelected] = useState<ArtifactId>('assembly')
  const [amounts, setAmounts] = useState<Record<ArtifactId, number>>({ assembly: 35, navigation: 45, surface: 45 })
  const [seed, setSeed] = useState(1)
  const [steps, setSteps] = useState<Record<ArtifactId, number>>({ assembly: 0, navigation: 0, surface: 0 })
  const artifact = artifacts.find(item => item.id === selected)!
  const step = steps[selected]
  const note = artifact.sections[step]
  const select = (id: ArtifactId) => setSelected(id)

  return <section className="personal-section workbench" id="workbench" aria-labelledby="workbench-title">
    <div className="section-heading">
      <div className="flex items-baseline gap-5"><span className="mono section-index">02 /</span><h2 id="workbench-title">On the workbench</h2></div>
      <span className="mono section-caption">OPEN TO INSPECTION</span>
    </div>
    <p className="personal-intro">A few things I’ve built. Pick something up. Look underneath.</p>
    <div className="workspace" role="group" aria-label="Project artifacts">
      <div className="workspace-register mono" aria-hidden="true"><span>AM / WORKING STUDIES</span><span>03 OBJECTS</span></div>
      <div className="workspace-objects">
        {artifacts.map(item => <button type="button" key={item.id} className={`workspace-object object-${item.id}`} aria-label={`Inspect ${item.project}`} aria-pressed={selected === item.id} aria-controls="artifact-inspector" onClick={() => select(item.id)}>
          <span className="object-index mono">{item.index} / {item.kind}</span>
          <ArtifactDrawing id={item.id} amount={amounts[item.id]} seed={seed} />
          <span className="object-caption"><span><span className="object-project mono">{item.project}</span><span className="object-name">{item.name}</span></span><ArrowDownRight size={20} strokeWidth={1} aria-hidden="true" /></span>
        </button>)}
      </div>
      <div className="mobile-artifact"><ArtifactDrawing id={selected} amount={amounts[selected]} seed={seed} /></div>
      <div className="artifact-manipulator">
        <label htmlFor="artifact-adjustment"><span className="mono">{controlLabels[selected]}</span><input id="artifact-adjustment" type="range" min="0" max="100" step="1" value={amounts[selected]} aria-valuetext={selected === 'navigation' ? `${amounts[selected]} percent through illustrative route` : `${amounts[selected]} percent`} onChange={event => setAmounts(previous => ({ ...previous, [selected]: Number(event.target.value) }))} /></label>
        {selected === 'surface' && <button className="seed-button mono" type="button" onClick={() => setSeed(value => value + 1)}><RotateCcw size={13} aria-hidden="true" />NEW SEED / {seed}</button>}
        <span className="workspace-caption mono">INTERACTIVE STUDIES / ILLUSTRATIVE GEOMETRY</span>
      </div>
    </div>
    <p className="sr-only" role="status">Inspecting {artifact.project}. {controlLabels[selected]} control and project notes follow the objects.</p>
    <div className="artifact-inspector" id="artifact-inspector" role="region" aria-label={`${artifact.project} working notes`}>
      <div className="artifact-context" key={selected}>
        <span className="mono artifact-eyebrow">ON THE DESK / {artifact.index}</span>
        <h3>{artifact.project}</h3><p>{artifact.summary}</p>
        <p className="artifact-technologies mono">{artifact.technologies}</p>
        <a href={artifact.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${artifact.project} source (opens in a new tab)`}>Open the project<ArrowUpRight size={16} aria-hidden="true" /></a>
        {selected === 'surface' && <a href={`${githubUrl}/vol_engine`} target="_blank" rel="noopener noreferrer" aria-label="View Vol Engine source (opens in a new tab)">Related: Vol Engine<ArrowUpRight size={16} aria-hidden="true" /></a>}
      </div>
      <div className="artifact-notes">
        <div className="artifact-steps" role="group" aria-label={`${artifact.project} inspection stages`}>
          {artifact.sections.map((section, index) => <button type="button" key={section.label} aria-pressed={step === index} aria-controls="artifact-note" onClick={() => {
            setSteps(previous => ({ ...previous, [selected]: index }))
            if (selected === 'navigation') setAmounts(previous => ({ ...previous, navigation: [0, 45, 100][index] }))
            if (selected === 'assembly') setAmounts(previous => ({ ...previous, assembly: [75, 40, 0][index] }))
          }}><span className="mono">0{index + 1}</span>{section.label}</button>)}
        </div>
        <div id="artifact-note" className="artifact-note" key={`${selected}-${step}`}><h4>{note.title}</h4><p>{note.text}</p></div>
      </div>
    </div>
    <div className="workbench-colophon mono"><span><span className="status-dot" aria-hidden="true" />MODE / INSPECTING</span><span>SOME ASSEMBLY ENCOURAGED.</span></div>
  </section>
}
