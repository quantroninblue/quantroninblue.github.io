import { Plus } from 'lucide-react'
import { fieldNotes } from './content'

export function FieldNotes() {
  return <section className="personal-section field-notes" id="field-notes" aria-labelledby="field-notes-title">
    <div className="section-heading">
      <div className="flex items-baseline gap-5"><span className="mono section-index">03 /</span><h2 id="field-notes-title">Field notes</h2></div>
      <span className="mono section-caption">NOTES FROM THE PROJECTS</span>
    </div>
    <p className="personal-intro">Questions raised by the work. Context in the margins.</p>
    <div className="field-note-list">
      {fieldNotes.map(note => <details key={note.number} className="field-note" name="field-notes">
        <summary>
          <span className="mono field-note-index">{note.number}</span>
          <span className="field-note-title"><span>{note.title}</span><span className="field-note-teaser">{note.teaser}</span></span>
          <span className="mono field-note-tag">{note.tag}</span>
          <Plus size={18} strokeWidth={1.3} aria-hidden="true" />
        </summary>
        <div className="field-note-body"><p>{note.paragraph}</p><p className="field-note-question"><span className="mono">OPEN QUESTION</span>{note.question}</p></div>
      </details>)}
    </div>
    <p className="notebook-colophon mono">WORKING NOTES / ROOM TO REVISE.</p>
  </section>
}
