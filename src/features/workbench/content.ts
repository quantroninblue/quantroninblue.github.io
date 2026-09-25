// Editable notebook prompts grounded in the named projects, not attributed quotes
// or claims of currently ongoing research. Keep the context alongside each prompt.
export const fieldNotes = [
  {
    number: '01', title: 'What should survive a failed attempt?', tag: 'ODYSSEUS / MEMORY',
    teaser: 'A navigation problem that becomes a memory problem.',
    paragraph: 'Odysseus connects failure reasoning to persistent spatial memory: hazardous regions, reliable corridors, and recovery choices. The interesting question extends beyond finding another path.',
    question: 'Which parts of a failure are useful the next time around?',
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
