// Skills grouped for the interactive skill map. There are no proficiency percentages.
// Each skill links to the projects and roles that actually used it (computed from
// project.stack and experience.tags through `match` aliases).

import { projects } from './projects.js'
import { experience } from './experience.js'

export const skillGroups = [
  {
    id: 'programming',
    label: 'Programming',
    icon: 'code',
    hue: 'blue',
    blurb: 'Languages I write day to day, from Python notebooks to firmware.',
    skills: [
      { name: 'Python', match: ['Python'] },
      { name: 'JavaScript', match: ['JavaScript', 'React', 'React.js', 'Node.js'] },
      { name: 'TypeScript', match: ['TypeScript'] },
      { name: 'C / C++', match: ['Arduino (C++)'] },
      { name: 'Embedded C', match: ['Arduino (C++)', 'ESP32', 'ESP32-CAM'] },
      { name: 'Java', match: [], note: 'NPTEL Elite certification · DSA with Java' },
      { name: 'SQL', match: ['SQL', 'PostgreSQL', 'Stored procedures'] },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: 'layout',
    hue: 'cyan',
    blurb: 'Responsive, fast interfaces with modern React tooling and 3D on the web.',
    skills: [
      { name: 'React.js', match: ['React', 'React.js'] },
      { name: 'Next.js', match: ['Next.js'] },
      { name: 'HTML5', match: ['HTML/CSS/JS'] },
      { name: 'CSS3', match: ['HTML/CSS/JS', 'Tailwind CSS'] },
      { name: 'Tailwind CSS', match: ['Tailwind CSS'] },
      { name: 'Responsive UI', match: ['Next.js', 'React.js', 'React'] },
      { name: 'Three.js / R3F', match: [], note: 'Powers the 3D scenes on this site' },
      { name: 'React Native', match: ['React Native'] },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: 'server',
    hue: 'violet',
    blurb: 'APIs and services, from REST and WebSockets to event-driven microservices.',
    skills: [
      { name: 'Node.js', match: ['Node.js'] },
      { name: 'Express.js', match: ['Express.js'] },
      { name: 'FastAPI', match: ['FastAPI'] },
      { name: 'Flask', match: ['Flask'] },
      { name: 'REST APIs', match: ['REST APIs', 'Express.js', 'FastAPI'] },
      { name: 'WebSockets', match: ['WebSockets', 'Socket.io'] },
      { name: 'JWT & RBAC', match: ['JWT'] },
      { name: 'Microservices', match: ['Kafka'] },
    ],
  },
  {
    id: 'ai',
    label: 'AI / ML',
    icon: 'brain',
    hue: 'pink',
    blurb: 'Models that see, predict and generate, taken from notebook to working app.',
    skills: [
      { name: 'Machine Learning', match: ['Machine Learning', 'scikit-learn', 'XGBoost'] },
      { name: 'Deep Learning', match: ['PyTorch', 'DeepFace', 'DistilRoBERTa'] },
      { name: 'Computer Vision', match: ['OpenCV', 'DeepFace'] },
      { name: 'OpenCV', match: ['OpenCV'] },
      { name: 'PyTorch', match: ['PyTorch'] },
      { name: 'scikit-learn', match: ['scikit-learn'] },
      { name: 'Pandas & NumPy', match: ['Pandas', 'NumPy'] },
      { name: 'LLM apps (Claude, MCP)', match: ['Claude API', 'MCP'] },
      { name: 'Generative AI', match: ['Gemini API', 'Generative AI'] },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    icon: 'database',
    hue: 'green',
    blurb: 'Relational, document and in-memory stores, picked for the workload.',
    skills: [
      { name: 'PostgreSQL', match: ['PostgreSQL'] },
      { name: 'MySQL', match: [] },
      { name: 'MongoDB', match: ['MongoDB'] },
      { name: 'Redis', match: ['Redis'] },
      { name: 'Prisma ORM', match: ['Prisma'] },
      { name: 'PostGIS', match: ['PostGIS'] },
    ],
  },
  {
    id: 'embedded',
    label: 'Embedded Systems',
    icon: 'cpu',
    hue: 'amber',
    blurb: 'Microcontrollers, motors and sensors, connected to the web.',
    skills: [
      { name: 'Arduino', match: ['Arduino (C++)', 'Arduino'] },
      { name: 'ESP32', match: ['ESP32', 'ESP32-CAM'] },
      { name: 'IoT', match: ['IoT', 'ESP32', 'ESP32-CAM'] },
      { name: 'Robotics', match: ['Robotics', 'L298N', 'Servos'] },
      { name: 'Motor control & PWM', match: ['L298N', 'PWM', 'Servos'] },
      { name: 'CAN', match: [] },
      { name: 'SPI', match: [] },
      { name: 'I2C', match: [] },
      { name: 'UART', match: [] },
    ],
  },
  {
    id: 'tools',
    label: 'Cloud & Tools',
    icon: 'cloud',
    hue: 'indigo',
    blurb: 'Shipping, testing and reporting: the tooling around the code.',
    skills: [
      { name: 'Git & GitHub', match: ['GitHub Actions'] },
      { name: 'CI/CD', match: ['GitHub Actions'] },
      { name: 'Docker', match: ['Docker'] },
      { name: 'AWS S3', match: [] },
      { name: 'Unit testing', match: ['Vitest', 'Playwright'] },
      { name: 'Power BI', match: ['Power BI'] },
      { name: 'Tableau', match: ['Tableau'] },
      { name: 'Excel', match: ['Excel'] },
    ],
  },
]

/** Attach evidence: projects and roles where each skill was used. */
export const skillMap = skillGroups.map((group) => ({
  ...group,
  skills: group.skills.map((skill) => {
    const m = new Set(skill.match.map((s) => s.toLowerCase()))
    const usedIn = projects.filter((p) => p.stack.some((s) => m.has(s.toLowerCase()))).map((p) => ({ slug: p.slug, title: p.shortTitle || p.title }))
    const roles = experience.filter((e) => e.tags.some((t) => m.has(t.toLowerCase()))).map((e) => ({ id: e.id, title: e.company }))
    return { ...skill, usedIn, roles }
  }),
}))

export const allSkills = skillMap.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.id, hue: g.hue })))
