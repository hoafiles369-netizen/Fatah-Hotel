"use client";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import FatahHotelHero from '../components/FatahHotelHero';
const BookSection = lazy(() => import('../components/InteractiveBook'));
const ScatterTestimonial = lazy(() => import('../components/ScatterTestimonial'));
const SpotlightText = lazy(() => import('../components/SpotlightText'));
const HotelStaffGrid = lazy(() => import('../components/HotelStaffGrid'));

/* ─────────────────────────────────────────────
   FATAH HOTEL  –  Premium Homepage
   Stack : React + Tailwind (CDN) + inline CSS
   ───────────────────────────────────────────── */

/* ── tiny helpers ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

/* ── palette & tokens ── */
const TOKEN = {
  gold: "#C9A96E",
  goldLight: "#E8C98A",
  goldDark: "#9B7A4A",
  cream: "#FAF7F2",
  dark: "#0D0B08",
  darkCard: "#131109",
  glass: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(201,169,110,0.25)",
};

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */
const FOOD_ITEMS = [
  {
    name: "Saffron Risotto",
    price: "Available on request",
    tag: "Chef's Special",
    desc: "Aged Parmigiano, truffle oil, hand-picked saffron threads from Kashmir.",
    emoji: "🍝",
    bg: "from-amber-900/40 to-yellow-900/20",
  },
  {
    name: "Grilled Sea Bass",
    price: "Available on request",
    tag: "Signature",
    desc: "Mediterranean sea bass, lemon beurre blanc, micro-herb garden garnish.",
    emoji: "🐟",
    bg: "from-blue-900/40 to-teal-900/20",
  },
  {
    name: "Wagyu Tenderloin",
    price: "Available on request",
    tag: "Premium Cut",
    desc: "A5 Wagyu, roasted bone marrow butter, caramelised shallot jus.",
    emoji: "🥩",
    bg: "from-red-900/40 to-rose-900/20",
  },
  {
    name: "Black Truffle Soup",
    price: "Available on request",
    tag: "House Favourite",
    desc: "Velvety wild mushroom broth, shaved Périgord truffle, brioche croutons.",
    emoji: "🍲",
    bg: "from-stone-800/50 to-neutral-900/30",
  },
  {
    name: "Mango Soufflé",
    price: "Available on request",
    tag: "Dessert",
    desc: "Alphonso mango, Madagascar vanilla bean, feather-light choux pastry.",
    emoji: "🍮",
    bg: "from-orange-900/40 to-yellow-800/20",
  },
];

const ROOMS = [
  {
    name: "Deluxe Suite",
    price: "Availability on request",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop"
    ],
    features: ["King Bed", "City View", "Free Wi-Fi", "Mini Bar"],
    desc: "Sweeping panoramic views with bespoke furnishings and marble bath.",
  },
  {
    name: "Royal Penthouse",
    price: "Availability on request",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop"
    ],
    features: ["Private Terrace", "Jacuzzi", "Butler Service", "Chef's Table"],
    desc: "The pinnacle of luxury — a private world above the city skyline.",
  },
  {
    name: "Garden Villa",
    price: "Availability on request",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop"
    ],
    features: ["Private Pool", "Garden View", "Spa Access", "Breakfast"],
    desc: "Lush botanical surrounds, plunge pool, and total serene privacy.",
  },
  {
    name: "Ocean Retreat",
    price: "Availability on request",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?q=80&w=2070&auto=format&fit=crop"
    ],
    features: ["Ocean Front", "Balcony", "Infinity Pool", "Sunset View"],
    desc: "Wake up to the sound of waves in this exclusive oceanfront sanctuary.",
  },
];

const CASE_STUDIES = [
  {
    title: "Boutique Hotel Booking Redesign",
    problem:
      "Direct bookings were low and most visitors dropped before reaching the booking step.",
    solution:
      "Rebuilt the homepage flow, simplified navigation, improved mobile UX, and reduced page weight.",
    result: "Direct bookings up 34%, conversion rate up 22%, load time improved from 3.4s to 1.7s.",
  },
  {
    title: "Restaurant Lead Generation Website",
    problem:
      "The business had traffic from social media but very few qualified inquiry leads.",
    solution:
      "Created clear service messaging, added high-intent CTAs, and built a faster contact journey.",
    result: "Qualified leads up 41%, form completion up 29%, mobile bounce rate down 26%.",
  },
  {
    title: "Service Business Trust Upgrade",
    problem:
      "Website looked outdated and did not communicate process, reliability, or proof of delivery.",
    solution:
      "Added case studies, technical proof blocks, and a client-first workflow section.",
    result: "Consultation requests up 37% and average time on site increased by 48%.",
  },
];

const TECHNICAL_PROOF = [
  {
    label: "PageSpeed",
    value: "90+ target on mobile and desktop",
    desc: "Performance-first build with optimized assets and lightweight interactions.",
  },
  {
    label: "Responsive QA",
    value: "Mobile, tablet, desktop ready",
    desc: "Layout and interaction checks across common screen sizes and devices.",
  },
  {
    label: "SEO Basics",
    value: "Metadata, headings, semantic structure",
    desc: "On-page SEO foundations set for visibility and indexing.",
  },
  {
    label: "CMS/Admin Ready",
    value: "Content updates without code edits",
    desc: "Structured content model so clients can manage text, media, and pages easily.",
  },
  {
    label: "Security + Backup",
    value: "Deployment hardening and backup flow",
    desc: "Basic security setup, access control, and recovery-friendly backup routine.",
  },
];

const NAV_LINKS = ["Home", "Rooms", "About", "Contact"];

/* ══════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════ */

/* ── Section Label ── */
function SectionLabel({ label }: { label: string }) {
  return (
    <p
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: "0.68rem",
        letterSpacing: "0.45em",
        textTransform: "uppercase",
        color: TOKEN.gold,
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 32,
          height: 1,
          background: TOKEN.gold,
        }}
      />
      {label}
    </p>
  );
}

import CardStack from '../components/CardStack';

/* ── Featured Menu ── */
function FeaturedMenu() {
  const { ref, visible } = useInView();
  
  return (
    <section
      id="menu"
      ref={ref}
      className="responsive-padding"
      style={{
        background: "rgba(13,11,8,0.95)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* bg decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${TOKEN.gold}50, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -200,
          top: "20%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${TOKEN.gold}08 0%, transparent 70%)`,
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
            marginBottom: "2rem",
            padding: "0 2rem"
          }}
        >
          <SectionLabel label="Curated Dining" />
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 300,
              color: TOKEN.cream,
              lineHeight: 1.1,
              maxWidth: 520,
            }}
          >
            An Editorial{" "}
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 700,
                color: TOKEN.gold,
              }}
            >
              Menu
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.95rem",
              color: "rgba(250,247,242,0.5)",
              maxWidth: 440,
              marginTop: "0.8rem",
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            Each dish is a study in technique and provenance. Explore our interactive menu below.
          </p>
        </div>

        {/* Card Stack */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(50px)",
            transition: "all 1.0s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}
        >
          <CardStack />
        </div>
      </div>
    </section>
  );
}

/* ── Rooms / Testimonials ── */
function Rooms() {
  const { ref, visible } = useInView();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="rooms"
      ref={ref}
      className="responsive-padding"
      style={{
        background: "rgba(10,9,5,0.95)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${TOKEN.gold}40, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -200,
          bottom: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${TOKEN.gold}07 0%, transparent 70%)`,
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
            marginBottom: "4rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <SectionLabel label="Our Rooms" />
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 300,
                color: TOKEN.cream,
                lineHeight: 1.1,
              }}
            >
              Stay in{" "}
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 700,
                  color: TOKEN.gold,
                }}
              >
                Absolute Luxury
              </span>
            </h2>
          </div>
          <a
            href="#contact"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: TOKEN.gold,
              textDecoration: "none",
              border: `1px solid ${TOKEN.gold}50`,
              padding: "10px 22px",
              borderRadius: 4,
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget).style.background = `${TOKEN.gold}15`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget).style.background = "transparent";
            }}
          >
            View All Rooms →
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {ROOMS.map((room, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? hovered === i
                    ? "translateY(10px)"
                    : "translateY(0)"
                  : "translateY(60px)",
                transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${0.15 * i}s, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease`,
                borderRadius: "16px",
                overflow: "hidden",
                background: TOKEN.darkCard,
                border: `1px solid ${hovered === i ? TOKEN.gold + "55" : TOKEN.glassBorder}`,
                boxShadow:
                  hovered === i
                    ? `0 30px 70px rgba(0,0,0,0.7), 0 0 20px ${TOKEN.gold}20`
                    : "0 10px 30px rgba(0,0,0,0.4)",
                cursor: "pointer",
              }}
            >
              {/* Room images */}
              <div
                style={{
                  height: 240,
                  position: "relative",
                  overflow: "hidden",
                  background: "#000",
                }}
              >
                {/* Image 1 (Default) */}
                <img
                  src={room.images[0]}
                  alt={room.name}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: hovered === i ? 0 : 1,
                    transition: "opacity 0.4s ease",
                    transform: hovered === i ? "scale(1.05)" : "scale(1)",
                    willChange: "transform, opacity",
                  }}
                />
                {/* Image 2 (Hover) */}
                <img
                  src={room.images[1]}
                  alt={`${room.name} view`}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: hovered === i ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    transform: hovered === i ? "scale(1.1)" : "scale(1.05)",
                    willChange: "transform, opacity",
                  }}
                />
                
                {/* Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, transparent 50%, rgba(13,11,8,0.9))",
                    zIndex: 1,
                  }}
                />

                {/* Price badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    background: `linear-gradient(135deg, ${TOKEN.gold}, ${TOKEN.goldDark})`,
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: TOKEN.dark,
                    boxShadow: `0 4px 14px ${TOKEN.gold}50`,
                    zIndex: 2,
                  }}
                >
                  {room.price}
                </div>
              </div>

              <div style={{ padding: "1.5rem" }}>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: TOKEN.cream,
                    marginBottom: "0.5rem",
                  }}
                >
                  {room.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.85rem",
                    color: "rgba(250,247,242,0.55)",
                    lineHeight: 1.7,
                    fontWeight: 300,
                    marginBottom: "1.2rem",
                  }}
                >
                  {room.desc}
                </p>

                {/* Features */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: "1.5rem",
                  }}
                >
                  {room.features.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "4px 12px",
                        borderRadius: 4,
                        background: `${TOKEN.gold}12`,
                        border: `1px solid ${TOKEN.gold}35`,
                        color: TOKEN.goldLight,
                        fontWeight: 500,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Book now */}
                <button
                  style={{
                    width: "100%",
                    padding: "13px",
                    background:
                      hovered === i
                        ? `linear-gradient(135deg, ${TOKEN.gold}, ${TOKEN.goldDark})`
                        : "transparent",
                    border: `1px solid ${hovered === i ? "transparent" : TOKEN.gold + "55"}`,
                    borderRadius: 6,
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: hovered === i ? TOKEN.dark : TOKEN.gold,
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow:
                      hovered === i ? `0 8px 24px ${TOKEN.gold}40` : "none",
                  }}
                >
                  Check Availability
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Divider stat bar ── */
function StatBar() {
  const { ref, visible } = useInView();
  const stats = [
    { num: "12+", label: "Years of Excellence" },
    { num: "240", label: "Luxury Rooms" },
    { num: "98%", label: "Guest Satisfaction" },
    { num: "3", label: "Michelin Stars" },
  ];
  return (
    <section
      ref={ref}
      className="responsive-padding-small"
      style={{
        background: `linear-gradient(135deg, #110F09, #0A0905)`,
        borderTop: `1px solid ${TOKEN.glassBorder}`,
        borderBottom: `1px solid ${TOKEN.glassBorder}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.12 * i}s`,
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "3.5rem",
                fontWeight: 700,
                color: TOKEN.gold,
                lineHeight: 1,
                marginBottom: "0.4rem",
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(250,247,242,0.45)",
                fontWeight: 400,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Footer ── */
function CaseStudiesSection() {
  const { ref, visible } = useInView();
  return (
    <section
      id="case-studies"
      ref={ref}
      className="responsive-padding"
      style={{
        background: "rgba(11,10,7,0.97)",
        borderTop: `1px solid ${TOKEN.glassBorder}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="Business Outcomes" />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: 300,
            color: TOKEN.cream,
            lineHeight: 1.1,
            marginBottom: "0.8rem",
          }}
        >
          Case studies that show
          <span style={{ color: TOKEN.gold, fontStyle: "italic", marginLeft: 10 }}>
            measurable results
          </span>
        </h2>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            color: "rgba(250,247,242,0.6)",
            maxWidth: 700,
            lineHeight: 1.8,
            marginBottom: "2rem",
          }}
        >
          Buyers look for outcomes. These examples present the problem, the solution, and the business impact.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {CASE_STUDIES.map((study, index) => (
            <article
              key={study.title}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.6s ease ${index * 0.08}s`,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${TOKEN.glassBorder}`,
                borderRadius: 14,
                padding: "1.4rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.5rem",
                  color: TOKEN.cream,
                  marginBottom: "0.8rem",
                }}
              >
                {study.title}
              </h3>
              <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(250,247,242,0.72)", lineHeight: 1.7 }}>
                <strong style={{ color: TOKEN.goldLight }}>Problem:</strong> {study.problem}
              </p>
              <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(250,247,242,0.72)", lineHeight: 1.7, marginTop: "0.7rem" }}>
                <strong style={{ color: TOKEN.goldLight }}>Solution:</strong> {study.solution}
              </p>
              <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(250,247,242,0.9)", lineHeight: 1.7, marginTop: "0.7rem" }}>
                <strong style={{ color: TOKEN.gold }}>Result:</strong> {study.result}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnicalProofSection() {
  const { ref, visible } = useInView();
  return (
    <section
      id="technical-quality"
      ref={ref}
      className="responsive-padding-small"
      style={{
        background: "rgba(9,8,5,0.98)",
        borderTop: `1px solid ${TOKEN.glassBorder}`,
        borderBottom: `1px solid ${TOKEN.glassBorder}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="Technical Quality" />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 4.6vw, 3.2rem)",
            color: TOKEN.cream,
            fontWeight: 300,
            marginBottom: "1.4rem",
          }}
        >
          Built for performance, trust, and maintainability
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "1rem",
          }}
        >
          {TECHNICAL_PROOF.map((item, index) => (
            <div
              key={item.label}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.55s ease ${index * 0.06}s`,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${TOKEN.glassBorder}`,
                borderRadius: 12,
                padding: "1rem",
              }}
            >
              <p style={{ fontFamily: "'Jost', sans-serif", color: TOKEN.gold, fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {item.label}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", color: TOKEN.cream, fontSize: "1.35rem", marginTop: "0.5rem" }}>
                {item.value}
              </p>
              <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(250,247,242,0.62)", lineHeight: 1.7, marginTop: "0.5rem", fontSize: "0.92rem" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const { ref, visible } = useInView();
  const steps = [
    "Discovery",
    "Design",
    "Development",
    "Revisions",
    "Launch",
    "Support (First 14 days free)",
  ];

  return (
    <section
      id="process"
      ref={ref}
      className="responsive-padding"
      style={{
        background: "rgba(12,11,8,0.98)",
        borderTop: `1px solid ${TOKEN.glassBorder}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="Low-Risk Workflow" />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 4.5vw, 3.3rem)",
            fontWeight: 300,
            color: TOKEN.cream,
            marginBottom: "0.8rem",
          }}
        >
          Clear process, clear expectations, clear delivery
        </h2>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            color: "rgba(250,247,242,0.62)",
            lineHeight: 1.8,
            maxWidth: 760,
            marginBottom: "1.8rem",
          }}
        >
          You always know what comes next and what will be delivered. This workflow keeps your project predictable and low-risk.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.9rem",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${index * 0.06}s`,
                padding: "0.95rem",
                borderRadius: 10,
                border: `1px solid ${TOKEN.glassBorder}`,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ fontFamily: "'Jost', sans-serif", color: TOKEN.gold, fontSize: "0.73rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Step {index + 1}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", color: TOKEN.cream, fontSize: "1.35rem", marginTop: "0.45rem" }}>
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      id="contact"
      className="responsive-padding-small"
      style={{
        background: "#070603",
        borderTop: `1px solid ${TOKEN.glassBorder}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 400,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${TOKEN.gold}60, transparent)`,
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "1.2rem",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${TOKEN.gold}, ${TOKEN.goldDark})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 16,
                  color: TOKEN.dark,
                }}
              >
                F
              </div>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: TOKEN.cream,
                  letterSpacing: "0.08em",
                }}
              >
                FATAH <span style={{ color: TOKEN.gold }}>HOTEL</span>
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(250,247,242,0.4)",
                lineHeight: 1.8,
                fontWeight: 300,
                maxWidth: 240,
              }}
            >
              I design and develop conversion-focused websites for hotels, restaurants, and service businesses.
            </p>
          </div>

          {/* Pages */}
          {[
            {
              title: "Explore",
              links: ["Home", "Rooms", "Case Studies", "Process"],
            },
            {
              title: "What You Get",
              links: ["Business outcomes", "Technical quality", "Clear workflow", "14-day free support"],
            },
            {
              title: "Contact",
              links: [
                "alyanhaider369@gmail.com",
                "+92 325 5629527",
                "Alyan Haider",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: TOKEN.gold,
                  marginBottom: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((l) => (
                  <li key={l} style={{ marginBottom: "0.7rem" }}>
                    <a
                      href={l === "Home" ? "#home" : l === "Rooms" ? "#rooms" : l === "Case Studies" ? "#case-studies" : l === "Process" ? "#process" : l === "Business outcomes" ? "#case-studies" : l === "Technical quality" ? "#technical-quality" : l === "Clear workflow" ? "#process" : l === "14-day free support" ? "#process" : "#contact"}
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "0.88rem",
                        color: "rgba(250,247,242,0.45)",
                        textDecoration: "none",
                        fontWeight: 300,
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = TOKEN.cream)
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "rgba(250,247,242,0.45)")
                      }
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${TOKEN.glassBorder}`,
            paddingTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.75rem",
              color: "rgba(250,247,242,0.3)",
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
          >
            © {new Date().getFullYear()} Fatah Hotel. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Cookies"].map((t) => (
              <a
                key={t}
                href="#contact"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(250,247,242,0.3)",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = TOKEN.gold)
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "rgba(250,247,242,0.3)")
                }
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   ROOT
   ══════════════════════════════════════════════ */
export default function FatahHotel() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0D0B08; }

        @keyframes scrollPulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.4; transform: scaleY(0.6); }
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }

        /* custom scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0D0B08; }
        ::-webkit-scrollbar-thumb { background: #C9A96E55; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #C9A96E; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div id="home" style={{ background: TOKEN.dark, minHeight: "100vh", position: "relative" }}>
        <FatahHotelHero />
        <Suspense fallback={null}>
          <BookSection />
        </Suspense>
        <FeaturedMenu />
        <StatBar />
        <Rooms />
        <CaseStudiesSection />
        <TechnicalProofSection />
        <ProcessSection />
        <Suspense fallback={null}>
          <ScatterTestimonial />
          <SpotlightText />
          <HotelStaffGrid />
        </Suspense>
        <Footer />
      </div>
    </>
  );
}
