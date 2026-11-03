// Editable notebook prompts grounded in the named projects, not attributed quotes
// or claims of currently ongoing research. Keep the context alongside each prompt.
export const fieldNotes = [
  {
    number: '01', title: 'When is a place the same place?', tag: 'ARGUS / LOOP CLOSURE',
    teaser: 'A navigation problem that becomes a trust problem.',
    paragraph: 'Argus corrects drift by recognising where a robot has been. A wrong match bends the map for every robot on the site, so a match has to pass several independent checks before the map changes.',
    question: 'How sure should a system be before it rewrites what it knows?',
  },
  {
    number: '02', title: 'Where does the agent stop?', tag: 'HEPHAESTUS / BOUNDARIES',
    teaser: 'Tool use is also a question about control.',
    paragraph: 'Hephaestus puts typed tools, validation, and human approval around design operations. Each boundary makes part of the workflow explicit and inspectable.',
    question: 'What needs to be checked before an instruction becomes an action?',
  },
  {
    number: '03', title: 'What if the historical sample is too small?', tag: 'VOLATILITY / PROCEDURAL SYSTEMS',
    teaser: 'A terrain-generation idea, taken somewhere else.',
    paragraph: 'The procedural volatility project borrows fractal noise from terrain generation to create synthetic regimes. It is a concrete connection between two otherwise distant kinds of system.',
    question: 'Which assumptions only become visible when the inputs change?',
  },
] as const
