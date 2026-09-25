// Professional copy is sourced from public/cv.pdf. Keep claims and dates in sync
// with that document; live repository metrics belong in a future API feature.
export const profile = {
  name: 'Abhroneel Mukherjee',
  firstName: 'Abhroneel',
  lastName: 'Mukherjee',
  location: 'Pune, India',
  email: 'abhro00@gmail.com',
  githubUsername: 'quantroninblue',
  statement:
    'I build end-to-end intelligent systems across quantitative finance and autonomous robotics — connecting machine learning research with practical engineering.',
  cvUrl: `${import.meta.env.BASE_URL}cv.pdf`,
} as const

export const githubUrl = `https://github.com/${profile.githubUsername}`

export const selectedWork = [
  {
    number: '01',
    name: 'Vol Engine',
    field: 'Quantitative intelligence',
    description: 'A quantitative ML research system for SPX options decisions, from volatility forecasting to risk-aware portfolio construction.',
    technologies: 'XGBoost / PyTorch / Python',
    href: '#cv',
    action: 'Read in CV',
  },
  {
    number: '02',
    name: 'Odysseus',
    field: 'Autonomous robotics',
    description: 'Adaptive navigation with causal failure reasoning, targeted recovery, and persistent spatial memory.',
    technologies: 'ROS 2 / C++ / Gazebo',
    href: '#cv',
    action: 'Read in CV',
  },
  {
    number: '03',
    name: 'Hephaestus AI',
    field: 'LLM systems',
    description: 'An open-source robotics workbench connecting natural-language design with editable CAD, simulation, and ROS 2.',
    technologies: 'Python / CadQuery / ROS 2',
    // This project URL is explicitly supplied in the CV, not inferred from a title.
    href: `${githubUrl}/Hephaestus`,
    action: 'View source',
  },
] as const
