import { githubUrl, profile } from './profile'

// Transcribed from public/cv.pdf. Dates, counts, and versions are CV snapshots.
// Experience and CV render this same source to keep the two views consistent.
export const resume = {
  identity: 'Applied AI & Machine Learning Engineer',
  specialization: 'Quantitative Intelligence & Autonomous Robotics',
  location: 'Pune, Maharashtra, India',
  phone: '+91-9831867527',
  phoneHref: 'tel:+919831867527',
  linkedinName: 'Abhroneel Mukherjee', // The CV supplies a display name, not a URL.
  summary: 'Applied AI and machine learning engineer building end-to-end intelligent systems across quantitative finance and autonomous robotics. Architected Vol Engine, a quantitative decision system for SPX options research, and Odysseus, an adaptive navigation intelligence stack with causal failure reasoning and recovery. Also created Hephaestus, an open-source AI robotics workbench connecting natural-language orchestration with CAD, Gazebo, and ROS 2.',
  skills: [
    { label: 'Programming', items: 'Python, C++, SQL, Bash, R' },
    { label: 'Machine Learning', items: 'PyTorch, scikit-learn, XGBoost, GMMs, HMMs, multi-task learning, time-series validation, causal and probabilistic modeling, model evaluation, model governance' },
    { label: 'Applied AI & NLP', items: 'LLM APIs, NLP, prompt engineering, structured outputs, function/tool calling, agent orchestration, Retrieval-Augmented Generation (RAG), embeddings, vector search, LangChain, LangGraph, Hugging Face Transformers' },
    { label: 'Robotics & Autonomous Systems', items: 'ROS 2, Gazebo Harmonic, CadQuery, OpenCV, SLAM/VSLAM, RGB-D perception, sensor fusion, Kalman filtering, probabilistic localization, occupancy mapping, A*, path planning and control' },
    { label: 'ML Systems & Backend', items: 'FastAPI, Pydantic, Docker, Kubernetes, Linux, Git, GitHub Actions/CI, AWS, REST APIs, PostgreSQL, relational databases, vector databases, dataset versioning, experiment tracking, model serving, CUDA, ONNX' },
    { label: 'Scientific Computing', items: 'NumPy, Pandas, SciPy, Statsmodels' },
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
    id: 'vol-engine', project: 'Vol Engine', role: 'Machine Learning Researcher', organization: 'RiskOptima WealthTech',
    context: 'Remote · Part-time alongside MSc', dates: 'Jun 2026 – Present',
    bullets: [
      'Architecting Vol Engine, a production-oriented quantitative ML research system for systematic SPX options decisions, spanning market-data ingestion, feature engineering, volatility forecasting, regime detection, execution-cost modeling, risk, and portfolio construction.',
      'Built the forecasting stack around realized and implied volatility, skew, term structure, and regime features; used GMM/HMM state models and XGBoost realized-volatility forecasts to inform candidate selection.',
      'Designed a separate multi-task neural meta-label layer estimating win probability, expected return, and downside risk, with confidence-aware abstention and mandatory human review before any capital moves.',
      'Encoded transaction costs, margin, buying power, Greeks, and portfolio constraints into a narrow PRESCRIPTION/NO_TRADE decision contract suited to 0-DTE research workflows.',
      'Implemented versioned datasets and artifacts, resumable checkpoints, experiment tracking, purged walk-forward validation, out-of-distribution safeguards, replayable dry-run research, and 182 automated tests.',
    ],
  },
  {
    id: 'odysseus', project: 'Odysseus', role: 'Computer Vision & Robotics Intern', organization: 'Vector Robotics',
    context: 'Pune · Summer internship during MSc', dates: 'Summer 2026',
    bullets: [
      'Architected Odysseus, an adaptive embodied navigation intelligence architecture integrating perception, probabilistic localization, planning, adaptive recovery, and persistent spatial memory on a ROS 2 autonomy stack in Python and C++, validated in Gazebo.',
      'Developed a bounded local trajectory planner evaluating 63 candidate rollouts per control cycle against collision risk, clearance, heading alignment, and goal progress, with a deterministic runtime safety override.',
      'Built a PyTorch causal reasoning model that classifies outcomes across 11 failure and success causes and predicts recovery confidence, enabling targeted recovery rather than a single fallback behavior.',
      'Engineered persistent spatial memory for hazardous regions and reliable navigation corridors, plus retracing and exploration policies that adapt behavior across deployments.',
      'Integrated semantic segmentation, depth-aware estimation, Kalman multi-object tracking, probabilistic localization, local and persistent occupancy maps, and automated validation covering perception, planning, and safety.',
    ],
  },
]
export const openSource: ExperienceEntry[] = [
  {
    id: 'hephaestus', project: 'Hephaestus AI', role: 'Creator & Maintainer', organization: 'Open Source',
    context: 'Python · CadQuery · ROS 2 Jazzy · Gazebo Harmonic', dates: 'Jul 2026 – Present',
    links: [{ label: 'GitHub / Hephaestus', href: `${githubUrl}/Hephaestus` }, { label: 'PyPI / hephaestus-ai', href: 'https://pypi.org/project/hephaestus-ai' }],
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
