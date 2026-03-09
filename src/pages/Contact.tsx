import { motion } from 'motion/react';
import { Mail, MessageCircle, User, ShieldCheck, Clock3 } from 'lucide-react';

const TOKEN = {
  gold: '#C9A96E',
  goldLight: '#E8C98A',
  cream: '#FAF7F2',
  dark: '#0D0B08',
  darkCard: '#131109',
  glassBorder: 'rgba(201,169,110,0.25)',
};

export default function Contact() {
  const emailSubject = encodeURIComponent('Website Project Inquiry');
  const emailBody = encodeURIComponent('Hi Alyan, I would like to discuss a website project.');
  const emailLink = `mailto:alyanhaider369@gmail.com?subject=${emailSubject}&body=${emailBody}`;
  const whatsappText = encodeURIComponent('Hi Alyan, let\'s discuss your project.');
  const whatsappLink = `https://wa.me/923255629527?text=${whatsappText}`;

  const openEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = emailLink;
  };

  return (
    <div
      style={{
        background: TOKEN.dark,
        color: TOKEN.cream,
        minHeight: '100vh',
        padding: '5rem 1rem',
      }}
    >
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '1.5rem' }}
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
            Contact
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.1rem, 6vw, 4rem)',
              lineHeight: 1.1,
              fontWeight: 600,
            }}
          >
            Let&apos;s build your website
          </h1>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              color: 'rgba(250,247,242,0.75)',
              lineHeight: 1.85,
              maxWidth: 780,
              margin: '1rem auto 0',
            }}
          >
            I am available for professional project discussions. Click email or WhatsApp below to open a direct message window and contact me quickly.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
              padding: '1.1rem',
            }}
          >
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', marginBottom: '0.8rem', color: TOKEN.goldLight }}>
              Direct Contact Details
            </h2>
            <div style={{ display: 'grid', gap: '0.9rem' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <User size={20} color={TOKEN.gold} />
                <div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.72rem', color: 'rgba(250,247,242,0.55)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    Name
                  </p>
                  <p style={{ fontFamily: "'Jost', sans-serif" }}>Alyan Hider</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Mail size={20} color={TOKEN.gold} />
                <div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.72rem', color: 'rgba(250,247,242,0.55)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    <a
                      href={emailLink}
                      onClick={openEmail}
                      style={{ color: 'rgba(250,247,242,0.72)', textDecoration: 'none' }}
                    >
                      Email
                    </a>
                  </p>
                  <a href={emailLink} onClick={openEmail} style={{ color: TOKEN.cream, textDecoration: 'none', fontFamily: "'Jost', sans-serif" }}>
                    alyanhaider369@gmail.com
                  </a>
                  <div style={{ marginTop: 8 }}>
                    <a
                      href={emailLink}
                      onClick={openEmail}
                      style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '0.72rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: TOKEN.dark,
                        background: `linear-gradient(135deg, ${TOKEN.goldLight}, ${TOKEN.gold})`,
                        borderRadius: 999,
                        padding: '7px 12px',
                        fontWeight: 600,
                        transition: 'transform 180ms ease, box-shadow 180ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(201,169,110,0.28)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Email Me to Discuss
                    </a>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <MessageCircle size={20} color={TOKEN.gold} />
                <div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.72rem', color: 'rgba(250,247,242,0.55)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    WhatsApp
                  </p>
                  <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ color: TOKEN.cream, textDecoration: 'none', fontFamily: "'Jost', sans-serif" }}>
                    +923255629527
                  </a>
                  <div style={{ marginTop: 8 }}>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: TOKEN.dark,
                        background: `linear-gradient(135deg, ${TOKEN.goldLight}, ${TOKEN.gold})`,
                        borderRadius: 999,
                        padding: '7px 12px',
                        fontWeight: 600,
                        transition: 'transform 180ms ease, box-shadow 180ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(201,169,110,0.28)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Let&apos;s discuss your project
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
              padding: '1.1rem',
            }}
          >
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', marginBottom: '0.8rem', color: TOKEN.goldLight }}>
              What You Get
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: "'Jost', sans-serif", color: 'rgba(250,247,242,0.8)', lineHeight: 1.9 }}>
              <li>- Structured development process</li>
              <li>- Clean and maintainable code</li>
              <li>- Full-stack implementation</li>
              <li>- Smooth and responsive user experience</li>
              <li>- First 14 days support after launch</li>
            </ul>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: '1rem',
            background: 'linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.06))',
            border: `1px solid ${TOKEN.glassBorder}`,
            borderRadius: 14,
            padding: '1.1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.8rem',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: "'Jost', sans-serif" }}>
            <Clock3 size={18} color={TOKEN.gold} />
            Reply time: usually within 24 hours
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: "'Jost', sans-serif" }}>
            <ShieldCheck size={18} color={TOKEN.gold} />
            Clear communication and realistic timelines
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: "'Jost', sans-serif" }}>
            <MessageCircle size={18} color={TOKEN.gold} />
            Fastest contact: WhatsApp
          </div>
        </motion.section>
      </div>
    </div>
  );
}
