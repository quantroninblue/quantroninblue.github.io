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
    'I build end-to-end intelligent systems across quantitative finance and autonomous robotics, connecting machine learning research with practical engineering.',
  cvUrl: `${import.meta.env.BASE_URL}cv.pdf`,
} as const

export const githubUrl = `https://github.com/${profile.githubUsername}`

export const selectedWork = [
  {
    number: '01',
    name: 'Argus',
    field: 'Autonomous robotics',
    description: 'Navigation for robots it was not written for: describe a body once, and a hub maps and plans while Argo keeps each robot safe on board. Validated in simulation and Gazebo.',
    technologies: 'C++ / Python / ROS 2 / gRPC',
    href: `${githubUrl}/Argus`,
    action: 'View source',
  },
  {
    number: '02',
    name: 'Furnace',
    field: 'AI developer tools',
    description: 'An open-source AI coding workspace on Code OSS: every model in one conversation, local models for the small jobs, checkpoints, and plans that prove each step.',
    technologies: 'TypeScript / Electron / Code OSS',
    href: 'https://quantroninblue.github.io/Furnace/',
    action: 'Visit site',
  },
  {
    number: '03',
    name: 'Mercury',
    field: 'AI agents',
    description: 'One self-learning agent across your devices: message it from WhatsApp, the command line or an API, and it runs tasks on your paired machines with approvals. Built on Hermes Agent.',
    technologies: 'Python / WebSockets / Agents',
    href: `${githubUrl}/mercury`,
    action: 'View source',
  },
  {
    number: '04',
    name: 'Vol Engine',
    field: 'Quantitative intelligence',
    description: 'A quantitative ML research system for SPX options decisions, from volatility forecasting to risk-aware portfolio construction.',
    technologies: 'XGBoost / PyTorch / Python',
    href: '#cv',
    action: 'Read in CV',
  },
] as const
