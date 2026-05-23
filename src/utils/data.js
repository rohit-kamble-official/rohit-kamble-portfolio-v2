// ============================================================
// PORTFOLIO DATA — Rohit Kamble
// ============================================================

export const personalInfo = {
  name: 'Rohit Kamble',
  tagline: 'Full Stack Developer | AI Enthusiast | Creative Problem Solver',
  bio: [
    "I'm a final-year B.Tech Electrical Engineering student at S.B. Jain Institute, Nagpur — with a passion for Computer Science that transcends my core curriculum.",
    "Despite coming from a non-CS background, I've built a solid foundation in Full-Stack Web Development, App Development, and Core CS concepts — driven entirely by curiosity and relentless self-learning.",
    "Currently interning as a Software Development Intern at Zonovva Creative Agency, Pune, contributing to real-world projects using React, Node.js, MongoDB, SQL, and React Native.",
    "My goal is to build impactful, scalable digital solutions that solve real-world problems. I'm actively seeking SDE roles where I can grow, contribute, and leave a mark.",
  ],
  email: 'itsrohitrk.official@gmail.com',
  github: 'https://github.com/rohit-kamble-official',
  linkedin: 'https://www.linkedin.com/in/rohit-kamble-135575252',
  location: 'Nagpur, Maharashtra, India',
  resumeUrl: 'https://rohit-kamble-official.github.io/portfolio/Images/Rohit%20Kamble%20(CV)[1].pdf',
  available: true,
}

export const stats = [
  { label: 'Internships', value: 4, suffix: '' },
  { label: 'Projects Built', value: 15, suffix: '+' },
  { label: 'Certifications', value: 8, suffix: '' },
  { label: 'Hackathon Wins', value: 5, suffix: '' },
]

export const quickFacts = [
  { icon: '🎓', text: 'B.Tech EE — CGPA 7.8, S.B. Jain Institute, Nagpur' },
  { icon: '💼', text: 'SDE Intern at Zonovva Creative Agency, Pune' },
  { icon: '🏆', text: 'IIT Delhi E-Summit 2025 — Hack for Impact Finalist (Top 6 / 5000+ teams)' },
  { icon: '🤖', text: 'ML Engineer Intern — Codemate IT Services, Nagpur' },
  { icon: '📱', text: 'Android Developer Intern — India Edu Program (Google tools)' },
  { icon: '📍', text: 'Based in Nagpur, Maharashtra, India' },
  { icon: '🎯', text: 'Open to Full-Time SDE Roles from 2026' },
]

export const skills = [
  {
    category: 'Frontend',
    icon: '⚛️',
    color: 'purple',
    chips: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Chakra UI', 'React Native'],
  },
  {
    category: 'Backend',
    icon: '🔧',
    color: 'cyan',
    chips: ['Node.js', 'Express.js', 'Java', 'Python', 'REST APIs', 'DSA', 'OOPs'],
  },
  {
    category: 'Database & Tools',
    icon: '🗄️',
    color: 'gold',
    chips: ['MongoDB', 'SQL', 'PostgreSQL', 'Git', 'GitHub', 'Tableau', 'VS Code'],
  },
  {
    category: 'AI / Machine Learning',
    icon: '🤖',
    color: 'pink',
    chips: ['Scikit-learn', 'TensorFlow.js', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'OpenCV'],
  },
  {
    category: 'DevOps & Cloud',
    icon: '🐳',
    color: 'green',
    chips: ['Docker', 'CI/CD Pipelines', 'AWS (EC2, S3)', 'GitHub Actions', 'Vercel', 'Netlify', 'GitHub Pages'],
  },
  {
    category: 'Mobile & IoT',
    icon: '📱',
    color: 'purple',
    chips: ['React Native', 'Android Dev (SDK)', 'IoT Integration', 'OpenCV', 'Speech Recognition', 'Gesture Detection'],
  },
]

export const projects = [
  {
    id: 1,
    title: 'Full-Stack Stock Trading Platform',
    description: 'A comprehensive MERN-stack trading platform featuring secure user authentication, live product catalog, cart management, order tracking, and payment integration. Built for scalability and production-grade reliability.',
    emoji: '📈',
    category: 'fullstack',
    categoryLabel: 'Full Stack',
    featured: true,
    tags: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT', 'REST API'],
    github: 'https://github.com/rohit-kamble-official',
    live: null,
    color: 'purple',
  },
  {
    id: 2,
    title: 'Heart Failure Prediction System',
    description: 'ML-based clinical decision support tool that predicts heart disease risk using patient clinical and lifestyle data. Features advanced data preprocessing, feature engineering, and model optimization for high accuracy and real-world applicability.',
    emoji: '❤️',
    category: 'ai',
    categoryLabel: 'AI / ML',
    featured: false,
    tags: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Seaborn', 'Matplotlib'],
    github: 'https://github.com/rohit-kamble-official',
    live: null,
    color: 'pink',
  },
  {
    id: 3,
    title: 'Real-Time Mood-Based Music Player',
    description: 'Interactive music platform that detects emotions from images or text and recommends songs to match the mood. Built with modular component design for scalability, TensorFlow.js emotion detection, and smooth UX.',
    emoji: '🎵',
    category: 'ai',
    categoryLabel: 'AI + Full Stack',
    featured: true,
    tags: ['React', 'Chakra UI', 'Node.js', 'MongoDB', 'TensorFlow.js', 'Emotion API'],
    github: 'https://github.com/rohit-kamble-official',
    live: 'https://rohit-kamble-official.github.io/FInal_project_Website/',
    color: 'cyan',
  },
  {
    id: 4,
    title: 'Substation Sentinel — Electrical Monitoring',
    description: 'Real-time substation monitoring solution leveraging IoT devices to track electrical parameters and system health. Provides instant alerts, analytics dashboard, and operational insights for safe, reliable maintenance.',
    emoji: '⚡',
    category: 'iot',
    categoryLabel: 'IoT',
    featured: false,
    tags: ['IoT', 'Web Interface', 'Real-time Analytics', 'Alerts', 'Electrical Monitoring'],
    github: 'https://github.com/rohit-kamble-official/Substation-Inspection-Project.git',
    live: 'https://rohit-kamble-official.github.io/FInal_project_Website/',
    color: 'gold',
  },
  {
    id: 5,
    title: 'AI-Driven Smart Safety System for Women',
    description: "Hands-free AI safety system with gesture, voice, and shake detection for women's safety. Features real-time location tracking, threat detection, secure evidence collection, and instant alerts via SMS, WhatsApp, and email.",
    emoji: '🛡️',
    category: 'ai',
    categoryLabel: 'AI + IoT Safety',
    featured: true,
    tags: ['Python', 'OpenCV', 'IoT', 'Speech Recognition', 'Gesture Detection', 'AI Alerts'],
    github: 'https://github.com/rohit-kamble-official/Substation-Inspection-Project.git',
    live: null,
    color: 'pink',
  },
]

export const experience = [
  {
    title: 'Web Developer Intern',
    company: 'Zonovva Creative Agency',
    location: 'Pune, Maharashtra',
    period: 'May 2025 – Jul 2025',
    type: 'internship',
    color: 'neon',
    highlights: [
      'Developed and deployed 3+ responsive websites using React, JavaScript, HTML, and CSS ensuring cross-platform functionality.',
      'Achieved 100% on-time delivery for all client projects, maintaining high quality and professional development standards.',
    ],
  },
  {
    title: 'Machine Learning Engineer Intern',
    company: 'Codemate IT Services Pvt. Ltd',
    location: 'Nagpur, Maharashtra',
    period: 'May 2024 – Jun 2024',
    type: 'internship',
    color: 'cyan',
    highlights: [
      'Built and deployed 2 scalable ML models using Python, NumPy, Pandas, Scikit-learn, and TensorFlow.',
      'Collaborated with the engineering team to integrate AI/ML solutions into production environments seamlessly.',
    ],
  },
  {
    title: 'Android Developer Virtual Internship',
    company: 'India Edu Program',
    location: 'Virtual',
    period: 'Oct 2024 – Dec 2024',
    type: 'internship',
    color: 'pink',
    highlights: [
      'Completed a 10-week virtual internship on Android app development with Google developer tools.',
      'Worked on API integration, coding simulations, and debugging in real-world Android applications.',
    ],
  },
  {
    title: 'Data Analytics Intern',
    company: 'IStudio',
    location: 'Nagpur, Maharashtra',
    period: 'Jan 2025 – Mar 2025',
    type: 'internship',
    color: 'gold',
    highlights: [
      'Analyzed a 10,000-row dataset using SQL and Tableau, generating key business insights for final project.',
      'Selected based on impressive performance in the Internship Common Aptitude Test (ICAT).',
    ],
  },
]

export const education = [
  {
    degree: 'B.Tech — Electrical Engineering',
    minor: 'Minor in Computer Science',
    institute: 'S.B. Jain Institute of Technology, Management & Research',
    location: 'Nagpur, Maharashtra',
    period: '2022 – 2026',
    cgpa: '7.8',
    coursework: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Full-Stack Dev (MERN)', 'Machine Learning', 'Operating Systems', 'DBMS', 'Advanced Algorithms'],
  },
]

export const achievements = [
  {
    icon: '🥇',
    title: '1st Prize — Srujanotsava 1.0 Project Exhibition',
    body: 'Won for the innovative "Automatic Prasad Distributor" — recognized for exceptional innovation, teamwork, and practical implementation of a real-world solution.',
    issuer: 'S.B. Jain Institute of Technology',
  },
  {
    icon: '🥉',
    title: '3rd Prize (₹8,000) — Tech Trek Hackathon',
    body: '2nd Runner-Up at Sadhabai Raisoni College for a smart automation solution. Cash prize of ₹8,000 awarded for innovative engineering.',
    issuer: 'Sadhabai Raisoni College of Engineering',
  },
  {
    icon: '🚀',
    title: 'Hack for Impact Finalist — IIT Delhi E-Summit 2025',
    body: 'Selected from 5,000+ teams nationwide. Advanced through 3 rounds to become a Top 6 Finalist at IIIT Delhi, building impactful tech-driven solutions.',
    issuer: 'IIT Delhi • E-Summit 2025',
  },
  {
    icon: '🤖',
    title: 'Android Developer Virtual Internship Certificate',
    body: 'Awarded by AICTE & EduSkills for successfully completing a 10-week virtual internship with Google Developer tools and Android SDK.',
    issuer: 'AICTE & EduSkills • Oct–Dec 2024',
  },
  {
    icon: '📡',
    title: 'IEEE PES Day 2024 — Brand Ambassador',
    body: 'Recognized for outstanding dedication and support as Brand Ambassador for IEEE Power & Energy Society Day 2024.',
    issuer: 'IEEE Power & Energy Society',
  },
  {
    icon: '☕',
    title: 'NPTEL Elite — Programming in Java',
    body: 'Achieved Elite status in the 12-week NPTEL course on Programming in Java from IIT Kharagpur. Top-tier performance.',
    issuer: 'IIT Kharagpur • Jan–Apr 2024',
  },
  {
    icon: '⚡',
    title: 'Alpha — DSA with Java (Apna College)',
    body: 'Certificate of completion from Apna College for mastering Data Structures & Algorithms with Java — covering arrays, trees, graphs, and DP.',
    issuer: 'Apna College',
  },
]

export const services = [
  {
    icon: '🌐',
    title: 'Full Stack Development',
    desc: 'End-to-end MERN stack applications — from database design to polished, production-ready frontends with REST APIs.',
    color: 'purple',
    tags: ['React.js', 'Node.js', 'MongoDB', 'Express', 'REST API'],
  },
  {
    icon: '🐳',
    title: 'Docker & CI/CD Pipelines',
    desc: 'Containerize your app with Docker, automate builds & deployments with GitHub Actions CI/CD — ship faster with zero downtime.',
    color: 'green',
    tags: ['Docker', 'GitHub Actions', 'CI/CD', 'AWS EC2', 'Auto Deploy'],
  },
  {
    icon: '☁️',
    title: 'AWS Cloud Deployment',
    desc: 'Deploy scalable apps on AWS — EC2 instances, S3 storage, and cloud architecture for production-grade performance.',
    color: 'cyan',
    tags: ['AWS EC2', 'AWS S3', 'Cloud', 'Scalable', 'Production'],
  },
  {
    icon: '🤖',
    title: 'AI / ML Solutions',
    desc: 'ML models, data pipelines, and AI-powered features — from prediction systems to real-time emotion detection.',
    color: 'pink',
    tags: ['Python', 'Scikit-learn', 'TensorFlow.js', 'OpenCV', 'Pandas'],
  },
  {
    icon: '📱',
    title: 'Mobile Development',
    desc: 'Cross-platform React Native apps that deliver native performance on iOS and Android with polished UX.',
    color: 'purple',
    tags: ['React Native', 'Android', 'iOS', 'Cross-Platform'],
  },
  {
    icon: '🎨',
    title: 'Portfolio & UI Design',
    desc: 'Premium portfolio websites and UI components with futuristic design — Awwwards-quality, fully responsive.',
    color: 'gold',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Responsive'],
  },
]

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

export const techStack = [
  'React.js', 'Node.js', 'MongoDB', 'Python',
  'Machine Learning', 'React Native', 'Docker', 'AWS', 'CI/CD', 'Java', 'MERN Stack',
]

export const typedRoles = [
  'Full Stack Developer',
  'AI / ML Enthusiast',
  'MERN Stack Engineer',
  'React Native Developer',
  'Creative Problem Solver',
  'SDE Intern @ Zonovva',
]
