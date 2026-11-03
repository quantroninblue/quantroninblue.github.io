import { githubUrl, profile } from './profile'

// Transcribed from public/cv.pdf. Dates, counts, and versions are CV snapshots.
// Experience and CV render this same source to keep the two views consistent.
export const resume = {
  identity: 'Applied AI & Machine Learning Engineer',
  specialization: 'Autonomous Robotics · AI Agents · Local Models · Quantitative ML',
  location: 'Pune, Maharashtra, India',
  phone: '+91-9831867527',
  phoneHref: 'tel:+919831867527',
  linkedinName: 'Abhroneel Mukherjee', // The CV supplies a display name, not a URL.
  summary: 'Applied AI and machine learning engineer who designs and ships complete intelligent systems, from architecture to release, across autonomous robotics, AI agents, developer tools, and quantitative finance. AI Engineer at Renaissa AI Labs, building AI tools and fine-tuning local models. Creator of Argus, a robot navigation stack that adapts to bodies it was not written for; Furnace, a released AI coding workspace on Code OSS; Mercury, a self-learning agent that works across a user\'s devices; and Hephaestus, an AI robotics workbench published on PyPI. Architected Vol Engine, an SPX options decision system, and Odysseus, an adaptive robot navigation stack.',
  skills: [
    { label: 'Programming & Scientific Computing', items: 'Python, C++, TypeScript, SQL, Bash, R, NumPy, Pandas, SciPy, Statsmodels' },
    { label: 'Machine Learning', items: 'PyTorch, scikit-learn, XGBoost, GMMs, HMMs, multi-task learning, time-series validation, causal and probabilistic modeling, model evaluation, model governance' },
    { label: 'Applied AI & LLMs', items: 'LLM APIs (OpenAI, Anthropic), local LLMs (Ollama), fine-tuning open-weight models, agent orchestration, function/tool calling, Model Context Protocol (MCP), structured outputs, RAG, embeddings, vector search, LangChain, LangGraph, Hugging Face Transformers' },
    { label: 'Robotics & Autonomous Systems', items: 'ROS 2, Gazebo Harmonic, CadQuery, OpenCV, SLAM/VSLAM, RGB-D perception, sensor fusion, Kalman filtering, probabilistic localization, occupancy mapping, scan matching, loop closure, pose graph optimization, A*, path planning and control' },
    { label: 'Software, ML Systems & Backend', items: 'gRPC, Protobuf, mutual TLS, Electron, React, Node.js, Zod, FastAPI, Pydantic, Docker, Kubernetes, Linux, Git, GitHub Actions/CI, Playwright, AWS, REST APIs, PostgreSQL, vector databases, dataset versioning, experiment tracking, model serving, CUDA, ONNX' },
  ],
  education: [
    { degree: 'MSc Economics', detail: 'Data Analytics Specialisation', school: 'Symbiosis School of Economics', dates: '2025 – 2027' },
    { degree: 'BA (Honours)', detail: '', school: 'Symbiosis School of Liberal Arts', dates: '2020 – 2024' },
  ],
}

export type ExperienceEntry = {
  id: string; project: string; role: string; organization: string; context: string
  dates: string; bullets: string[]; links?: { label: string; href: string }[]
}
export const employment: ExperienceEntry[] = [
  {
    id: 'renaissa', project: 'Renaissa AI Labs', role: 'AI Engineer', organization: 'Renaissa AI Labs',
    context: 'Remote · Part-time alongside MSc', dates: 'Oct 2026 – Present',
    bullets: [
      'Develop AI tools for the company\'s models, and research and fine-tune local open-weight models for in-house use.',
      'Building an Electron/React/TypeScript desktop app that turns marketing copy, images, and video into evidence-backed reports on hook, clarity, audience fit, emotion, visuals, and call to action.',
      'Designed model adapters for media understanding, transcription, streamed reasoning (OpenAI-compatible), and neural-response prediction, with Zod-validated structured reports and a local fallback.',
    ],
  },
  {
    id: 'vol-engine', project: 'Vol Engine', role: 'Machine Learning Researcher', organization: 'RiskOptima WealthTech',
    context: 'Remote · Part-time alongside MSc', dates: 'Jun 2026 – Aug 2026',
    bullets: [
      'Architected Vol Engine, a production-oriented quantitative ML system for systematic SPX options decisions, spanning market-data ingestion, feature engineering, volatility forecasting, regime detection, execution-cost modeling, risk, and portfolio construction.',
      'Built the forecasting stack around realized and implied volatility, skew, term structure, and regime features, using GMM/HMM state models and XGBoost realized-volatility forecasts to inform candidate selection.',
      'Designed a multi-task neural meta-label layer estimating win probability, expected return, and downside risk, with confidence-aware abstention and mandatory human review before any capital moves.',
      'Encoded transaction costs, margin, buying power, Greeks, and portfolio constraints into a narrow PRESCRIPTION/NO_TRADE decision contract suited to 0-DTE research workflows.',
      'Implemented versioned datasets and artifacts, resumable checkpoints, experiment tracking, purged walk-forward validation, out-of-distribution safeguards, replayable dry-run research, and 182 automated tests.',
    ],
  },
  {
    id: 'odysseus', project: 'Odysseus', role: 'Computer Vision & Robotics Intern', organization: 'Vector Robotics',
    context: 'Pune · Summer internship during MSc', dates: 'Summer 2026',
    bullets: [
      'Architected Odysseus, an adaptive navigation stack integrating perception, probabilistic localization, planning, adaptive recovery, and persistent spatial memory on ROS 2 (Python, C++), validated in Gazebo.',
      'Developed a bounded local trajectory planner evaluating 63 candidate rollouts per control cycle against collision risk, clearance, heading alignment, and goal progress, with a deterministic runtime safety override.',
      'Built a PyTorch causal reasoning model that classifies outcomes across 11 failure and success causes and predicts recovery confidence, enabling targeted recovery rather than a single fallback behavior.',
      'Engineered persistent spatial memory for hazardous regions and reliable navigation corridors, plus retracing and exploration policies that adapt behavior across deployments.',
      'Integrated semantic segmentation, depth-aware estimation, Kalman multi-object tracking, and local and persistent occupancy maps, with automated validation covering perception, planning, and safety.',
    ],
  },
]
export const openSource: ExperienceEntry[] = [
  {
    id: 'argus', project: 'Argus', role: 'Creator & Maintainer', organization: 'Open Source (MIT)',
    context: 'C++ · Python · ROS 2 Jazzy · gRPC · Eigen · Gazebo Harmonic', dates: 'Oct 2026 – Present',
    links: [{ label: 'GitHub / Argus', href: 'https://github.com/quantroninblue/Argus' }],
    bullets: [
      'Created a navigation stack that adapts to robots it was not written for: describe a body once and Argus works out what it can do, then drives it through a hub and an on-robot node. About 25,000 lines of C++ and Python with 400+ automated tests, validated in simulation and Gazebo.',
      'Designed the system so each robot stays safe on its own: the hub sends only waypoints over gRPC with mutual TLS, while the on-robot C++ node runs the local map, the local planner, and a safety supervisor that can only slow or stop the robot, with a defined failsafe when the link drops.',
      'Built capability derivation from URDF (motion limits, stopping distances, sensor coverage by bearing and height, blind spots), so a robot never moves faster than its sensors can see to stop, plus tracking of people and moving obstacles and detection of drops in the floor.',
      'Built the hub: per-site maps merged from every robot\'s evidence, route planning in each body\'s own configuration space, exploration with backtracking out of dead ends, and named places with patrol routes.',
      'Implemented drift correction (point-to-line ICP) and loop closure (correlative scan matching, robust pose graph solved in C++ with Eigen), with layered checks against false matches; cut final pose error from 1.97 m to 0.24 m and stray map cells from 36.7% to 1.1% under injected yaw drift in simulation.',
      'Built a Gazebo validation pipeline that drives a user\'s own robot design with the real on-robot binary, records every run for replay, and attributes each failure to the design, Argus, or the world, with reference bodies across differential, skid-steer, mecanum, car-like, and quadcopter drives.',
      'Added optional model connections (local servers, APIs, and personal plans) that explain failed runs, review designs, and turn plain-language goals into confirmed trips, with answers cited against measured facts and no authority over safety limits.',
    ],
  },
  {
    id: 'furnace', project: 'Furnace', role: 'Creator & Maintainer', organization: 'Open Source (MIT)',
    context: 'TypeScript · Electron · React · Code OSS · MCP', dates: 'Oct 2026 – Present',
    links: [{ label: 'GitHub / Furnace', href: 'https://github.com/quantroninblue/Furnace' }],
    bullets: [
      'Created Furnace, a desktop coding workspace built on Code OSS (the open-source core of VS Code) where a developer and an AI agent plan, research, and build in the same project, released for macOS, Windows, and Linux.',
      'Built a multi-provider agent runtime across ChatGPT and Claude Code sign-in, OpenAI/Anthropic API keys, and local Ollama models, with Plan/Build/Research modes, tool calling, verified plan steps, checkpoints, and context condensing.',
      'Designed permission modes with a network-isolated command sandbox, saved allow/deny rules, Git-isolated background tasks, cost budgets, and no telemetry; 113 automated tests, Electron smoke suites, and protected GitHub Actions CI.',
    ],
  },
  {
    id: 'mercury', project: 'Mercury', role: 'Creator & Maintainer', organization: 'Open Source (MIT)',
    context: 'Python · WebSockets · SQLite · Electron · Hermes Agent', dates: 'Oct 2026 – Present',
    links: [{ label: 'GitHub / mercury', href: 'https://github.com/quantroninblue/mercury' }],
    bullets: [
      'Created a self-learning AI agent that works across a user\'s devices: message it from WhatsApp, the command line, or an API, and it carries out tasks on paired Windows, Android, Linux, and macOS machines within one continuing conversation.',
      'Extended the open-source Hermes Agent with a hub and device layer: a relay for pairing, policy, and task logging, and a lightweight node that connects out over encrypted WebSockets, so devices need no open ports, SSH server, or VPN.',
      'Built a self-learning loop in which the agent researches a recurring task, writes a skill with a script and a test, proves it in a sandbox, asks the user to approve it, and tracks its success rate so failing skills get fixed.',
      'Enforced control at every layer: approval hooks on the hub, a per-device policy on each node, revocation, and a local audit log of every task run or refused; 68 automated tests across hub and node.',
    ],
  },
  {
    id: 'hephaestus', project: 'Hephaestus AI', role: 'Creator & Maintainer', organization: 'Open Source',
    context: 'Python · CadQuery · ROS 2 Jazzy · Gazebo Harmonic', dates: 'Jul 2026 – Present',
    links: [{ label: 'GitHub / Hephaestus', href: 'https://github.com/quantroninblue/Hephaestus' }, { label: 'PyPI / hephaestus-ai', href: 'https://pypi.org/project/hephaestus-ai' }],
    bullets: [
      'Created and released an AI-native robotics workbench that turns natural-language design intent into editable CadQuery source, STEP/STL artifacts, Gazebo simulations, and ROS 2 workflows.',
      'Designed a typed tool-orchestration runtime with workspace-constrained atomic edits, human approval gates, deterministic validation, bounded subprocess execution, and session-owned process cleanup.',
      'Built and verified a differential-drive vertical slice spanning URDF/Xacro, SDF, ros_gz_bridge, gz_ros2_control, LiDAR, IMU, joint states, odometry, controller activation, and velocity-command motion in simulation.',
      'Published hephaestus-ai 0.1.1 to PyPI with pipx installation, 361 automated tests, protected GitHub Actions CI, reproducible wheel/sdist builds, and Trusted Publishing.',
    ],
  },
]

export const resumeContacts = [
  { label: profile.email, href: `mailto:${profile.email}` },
  { label: resume.phone, href: resume.phoneHref },
  { label: `github.com/${profile.githubUsername}`, href: githubUrl },
]
