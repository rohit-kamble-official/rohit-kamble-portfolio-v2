// ============================================================
// Portfolio V3: profile content
// Sources: Portfolio V2 (rohit-kamble-portfolio-v2.vercel.app), resume in /public,
// and the latest CV (Nov 2026). Edit here to update the whole site.
// ============================================================

export const profile = {
  name: 'Rohit Kamble',
  firstName: 'Rohit',
  initials: 'RK',
  headline: 'Building Intelligent Digital Experiences.',
  roles: ['Full Stack Developer', 'AI/ML Enthusiast', 'Robotics & IoT Engineer'],
  intro:
    'I build software that spans the web, machine learning and the hardware it runs on: from React interfaces and APIs to computer-vision models and ESP32 firmware.',
  location: 'Nagpur, Maharashtra, India',
  workPreference: 'Open to on-site, hybrid or remote roles across India',
  availability: 'Open to full-time opportunities',
  email: 'itsrohitrk.official@gmail.com',
  github: 'https://github.com/rohit-kamble-official',
  githubUser: 'rohit-kamble-official',
  linkedin: 'https://www.linkedin.com/in/rohit-kamble-135575252',
  linkedinHandle: 'rohit-kamble-135575252',
  resume: '/Rohit_Kamble_Resume.pdf',
  resumeFileName: 'Rohit_Kamble_Resume.pdf',
}

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
]

export const about = {
  title: 'From circuits to code to intelligence.',
  paragraphs: [
    "I'm an Electrical Engineering graduate (B.Tech, 2026, minor in Computer Science) who loves building things end to end. I design full-stack products with React, Node.js and FastAPI, train machine-learning models with Python and PyTorch, and program ESP32 and Arduino boards that drive motors, stream video and talk over Wi-Fi.",
    'I have completed four internships across web development, data analytics, Android and machine learning, where I shipped production client apps, automated SQL reporting and built predictive models.',
    "Beyond code, I lead and compete: I served as Vice-Chairperson of IEEE SBJITMR, reached the Top 6 of 5,000+ teams at Hack for Impact (IIIT Delhi), and won prizes at Tech Trek and Srujanotsava. I'm looking for roles where software, AI and hardware meet.",
  ],
  stats: [
    { value: '4', label: 'Internships' },
    { value: '15+', label: 'Projects built' },
    { value: 'Top 6', label: 'of 5,000+ teams' },
    { value: '7.8', label: 'CGPA / 10' },
  ],
  pillars: [
    {
      icon: 'layers',
      title: 'Full-stack products',
      body: 'React interfaces, Node/Express or FastAPI services, PostgreSQL or MongoDB data, shipped with Docker and CI/CD.',
    },
    {
      icon: 'brain',
      title: 'Applied AI & data',
      body: 'Computer vision and ML with PyTorch, OpenCV and scikit-learn, plus analytics dashboards and LLM integrations.',
    },
    {
      icon: 'cpu',
      title: 'Embedded & robotics',
      body: 'ESP32 and Arduino firmware, motor drivers and sensors, controlled in real time from the browser over WebSockets.',
    },
  ],
  facts: [
    { icon: 'graduation', text: 'B.Tech Electrical Engineering, minor in CS, SBJITMR Nagpur (CGPA 7.8)' },
    { icon: 'briefcase', text: '4 internships: web development, data analytics, Android and machine learning' },
    { icon: 'trophy', text: 'Top 6 of 5,000+ teams, Hack for Impact, IIIT Delhi (2025)' },
    { icon: 'users', text: 'Vice-Chairperson, IEEE SBJITMR (2025–2026)' },
    { icon: 'pin', text: 'Based in Nagpur, Maharashtra. Open to on-site, hybrid or remote roles' },
  ],
  strengths: ['Problem solving', 'Team collaboration', 'Fast learner', 'Communication', 'Adaptability', 'Critical thinking', 'Time management'],
}
