import { motion } from 'motion/react';

const TOKEN = {
  gold: '#C9A96E',
  goldLight: '#E8C98A',
  cream: '#FAF7F2',
  dark: '#0D0B08',
  darkCard: '#131109',
  glassBorder: 'rgba(201,169,110,0.25)',
};

const skills = [
  'Modern responsive web design',
  'Interactive UI components and animations',
  'Backend logic and database integration',
  'Search and filtering systems',
  'User authentication and account systems',
  'Product/listing management systems',
  'Favorites and saved items functionality',
  'Scalable backend architecture',
];

const projects = [
  {
    title: 'Modern Marketplace Platform',
    detail: 'Advanced search, filters, favorites system, and backend database logic.',
  },
  {
    title: 'Interactive Digital Book Component',
    detail: 'Animated page-flip system with dynamic image and content integration.',
  },
  {
    title: 'Custom Listing & Product Management System',
    detail: 'Authentication, database structure, and user-controlled listing workflows.',
  },
];

export default function About() {
  return (
    <div
      style={{
        background: TOKEN.dark,
        color: TOKEN.cream,
        minHeight: '100vh',
        padding: '5rem 1rem',
      }}
    >
      <div style={{ maxWidth: 1150, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: TOKEN.gold,
              fontSize: '0.72rem',
              marginBottom: '0.9rem',
            }}
          >
            About Me
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.1rem, 6vw, 4.2rem)',
              lineHeight: 1.1,
              fontWeight: 600,
            }}
          >
            Hi, my name is <span style={{ color: TOKEN.goldLight }}>Alyan Hider</span>
          </h1>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              color: 'rgba(250,247,242,0.75)',
              lineHeight: 1.85,
              maxWidth: 900,
              margin: '1rem auto 0',
            }}
          >
            I am a full stack developer focused on building modern, fast, and conversion-focused websites. I specialize in marketplace platforms, product listing systems, and interactive web experiences with clean UI and strong backend logic.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1rem',
          }}
        >
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: TOKEN.darkCard,
              border: `1px solid ${TOKEN.glassBorder}`,
              borderRadius: 14,
              padding: '1.25rem',
            }}
          >
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '0.8rem' }}>
              My Approach
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: "'Jost', sans-serif", color: 'rgba(250,247,242,0.76)', lineHeight: 1.9 }}>
              <li>- Clean design users understand instantly</li>
              <li>- Fast loading and optimized performance</li>
              <li>- Real backend functionality, not just UI mockups</li>
              <li>- Features built for practical business use</li>
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            style={{
              background: TOKEN.darkCard,
              border: `1px solid ${TOKEN.glassBorder}`,
              borderRadius: 14,
              padding: '1.25rem',
            }}
          >
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '0.8rem' }}>
              What Clients Can Expect
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: "'Jost', sans-serif", color: 'rgba(250,247,242,0.76)', lineHeight: 1.9 }}>
              <li>- Clear communication</li>
              <li>- Structured development process</li>
              <li>- Clean and maintainable code</li>
              <li>- Real functionality with scalable foundations</li>
            </ul>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: '1rem',
            background: TOKEN.darkCard,
            border: `1px solid ${TOKEN.glassBorder}`,
            borderRadius: 14,
            padding: '1.25rem',
          }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '0.9rem' }}>My Skills</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.7rem' }}>
            {skills.map((skill) => (
              <div
                key={skill}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  color: 'rgba(250,247,242,0.82)',
                  border: `1px solid ${TOKEN.glassBorder}`,
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 10,
                  padding: '0.7rem 0.8rem',
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: '1rem',
            background: TOKEN.darkCard,
            border: `1px solid ${TOKEN.glassBorder}`,
            borderRadius: 14,
            padding: '1.25rem',
          }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '0.9rem' }}>Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.8rem' }}>
            {projects.map((project) => (
              <article key={project.title} style={{ border: `1px solid ${TOKEN.glassBorder}`, borderRadius: 10, padding: '0.9rem' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.45rem', color: TOKEN.goldLight }}>
                  {project.title}
                </h3>
                <p style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(250,247,242,0.76)', lineHeight: 1.75, marginTop: '0.35rem' }}>
                  {project.detail}
                </p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: '1rem',
            background: 'linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.06))',
            border: `1px solid ${TOKEN.glassBorder}`,
            borderRadius: 14,
            padding: '1.25rem',
          }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '0.8rem' }}>What I Believe</h2>
          <p style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(250,247,242,0.86)', lineHeight: 1.9 }}>
            Good software is not about writing the most code. It is about building systems that are simple for users and reliable behind the scenes. I value honesty, practical thinking, and clear communication. My goal is to build products that continue to work well as the platform grows.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
