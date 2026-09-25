import { githubUrl } from '../../data/profile'

export type ArtifactId = 'assembly' | 'navigation' | 'surface'
export type Artifact = {
  id: ArtifactId; index: string; name: string; project: string; kind: string
  summary: string; href: string; technologies: string
  sections: { label: string; title: string; text: string }[]
}
// Project claims: public/cv.pdf and the linked public repositories.
// Visual studies explain ideas; they are not captured project output.
export const artifacts: Artifact[] = [
  {
    id: 'assembly', index: '01', name: 'An idea, assembled.', project: 'Hephaestus AI', kind: 'ASSEMBLY STUDY',
    summary: 'I built Hephaestus to connect natural-language design with editable CAD, simulation, and ROS 2. The useful part is being able to inspect what happens between the request and the robot.',
    href: `${githubUrl}/Hephaestus`, technologies: 'Python · CadQuery · ROS 2 · Gazebo',
    sections: [
      { label: 'Design', title: 'Keep the geometry editable.', text: 'Hephaestus generates CadQuery source and STEP/STL artifacts. The design remains code that can be inspected and changed, rather than a closed result. Separate the assembly above to inspect its parts.' },
      { label: 'Validate', title: 'A tool call needs boundaries.', text: 'The orchestration runtime uses typed tools, workspace-constrained atomic edits, human approval gates, and deterministic validation. Bounded subprocesses and session cleanup are part of the design.' },
      { label: 'Simulate', title: 'The model has to connect to something.', text: 'The differential-drive workflow spans URDF/Xacro, SDF, ROS–Gazebo bridges, sensors, controllers, and velocity-command motion in simulation. This drawing is an explanatory assembly, not an exported CAD model.' },
    ],
  },
  {
    id: 'navigation', index: '02', name: 'When the plan breaks.', project: 'Odysseus', kind: 'NAVIGATION STUDY',
    summary: 'I built Odysseus around perception, planning, and recovery. Its spatial memory records hazardous regions and useful corridors, so a failed attempt can change the next decision.',
    href: `${githubUrl}/Odysseus`, technologies: 'ROS 2 · Python / C++ · PyTorch · Computer vision',
    sections: [
      { label: 'Observe', title: 'Start with an uncertain world.', text: 'Semantic segmentation, depth-aware estimation, Kalman tracking, and probabilistic localization turn observations into useful spatial estimates. The map above is a simplified illustration of that problem.' },
      { label: 'Plan', title: 'Consider more than one way forward.', text: 'The local planner evaluates 63 candidate rollouts per control cycle against collision risk, clearance, heading alignment, and goal progress. A deterministic safety override remains outside the learned model.' },
      { label: 'Recover', title: 'Remember why an attempt failed.', text: 'A PyTorch causal reasoning model distinguishes 11 failure and success causes, with confidence guiding targeted recovery. Persistent spatial memory records hazards and reliable corridors for subsequent decisions.' },
    ],
  },
  {
    id: 'surface', index: '03', name: 'Terrain, but for volatility.', project: 'Procedural volatility', kind: 'SURFACE EXPERIMENT',
    summary: 'My volatility-surface generator borrows from Minecraft terrain engines: fractal noise becomes synthetic volatility structure. It explores conditions beyond the historical sample. Vol Engine is the related forecasting and decision-system work.',
    href: `${githubUrl}/minecraft-vol-surface-generator`, technologies: 'Python · Jupyter · Fractal noise · Quantitative systems',
    sections: [
      { label: 'Generate', title: 'Change the landscape.', text: 'The public project uses Perlin / fractal Brownian noise to generate synthetic volatility regimes. This small browser study uses deterministic layered noise: change the roughness or seed to reshape the surface.' },
      { label: 'Stress', title: 'History is only one sample.', text: 'Synthetic regimes provide alternative conditions for exploring hedging strategies, implied-volatility arbitrage, and regime robustness. The surface here is illustrative, not market data or a calibrated volatility model.' },
      { label: 'Decide', title: 'A forecast is not yet a decision.', text: 'In Vol Engine, volatility and regime forecasts connect to execution costs, risk, and portfolio constraints. Confidence-aware abstention and mandatory human review can turn a proposed action into NO_TRADE.' },
    ],
  },
]
