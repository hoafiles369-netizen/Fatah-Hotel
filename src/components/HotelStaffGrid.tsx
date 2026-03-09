import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  quote: string;
  specialty: string;
  avatar: string;
  coverImage: string;
  yearsAtHotel: number;
  badge: string; // emoji badge
}

// ─── Hotel Staff Data (15 members) ───────────────────────────────────────────
const STAFF: StaffMember[] = [
  {
    id: "s1",
    name: "Isabelle Fontaine",
    role: "Head Concierge",
    department: "Guest Relations",
    quote: "Every request is my personal mission. Your perfect stay begins the moment you ask.",
    specialty: "Private city tours & exclusive restaurant reservations",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 11,
    badge: "🗝️",
  },
  {
    id: "s2",
    name: "Marco Delacroix",
    role: "Executive Chef",
    department: "Fine Dining",
    quote: "Each dish is a journey. I craft memories you will carry long after you leave.",
    specialty: "Mediterranean tasting menus & seasonal farm-to-table cuisine",
    avatar: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 8,
    badge: "👨🍳",
  },
  {
    id: "s3",
    name: "Amara Osei",
    role: "Spa Director",
    department: "Wellness & Spa",
    quote: "True luxury is stillness. I create sanctuaries where time dissolves.",
    specialty: "Holistic wellness rituals & signature aromatherapy treatments",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 6,
    badge: "🌿",
  },
  {
    id: "s4",
    name: "Thomas Wren",
    role: "Butler",
    department: "Suite Services",
    quote: "Anticipating your needs before you voice them — that is the art of true service.",
    specialty: "Private butler services for penthouse & presidential suites",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 14,
    badge: "🎩",
  },
  {
    id: "s5",
    name: "Leila Nazari",
    role: "Sommelier",
    department: "Fine Dining",
    quote: "The right wine does not accompany a meal — it transforms it into an occasion.",
    specialty: "Rare vintage curation & bespoke wine pairing experiences",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 5,
    badge: "🍷",
  },
  {
    id: "s6",
    name: "James Harlow",
    role: "General Manager",
    department: "Hotel Management",
    quote: "Our standard is not excellence — it is the moment excellence feels ordinary to you.",
    specialty: "Personalised guest experience design & VIP programme oversight",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 18,
    badge: "⭐",
  },
  {
    id: "s7",
    name: "Sofia Reyes",
    role: "Event Coordinator",
    department: "Events & Banquets",
    quote: "I do not plan events. I architect unforgettable moments that bind people together.",
    specialty: "Intimate weddings, gala dinners & corporate retreats",
    avatar: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 7,
    badge: "🎊",
  },
  {
    id: "s8",
    name: "Riku Tanaka",
    role: "Head of Security",
    department: "Safety & Concierge",
    quote: "Peace of mind is the invisible luxury we provide around the clock.",
    specialty: "Discreet VIP protection & seamless guest privacy management",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 9,
    badge: "🛡️",
  },
  {
    id: "s9",
    name: "Celine Moreau",
    role: "Head Pastry Chef",
    department: "Fine Dining",
    quote: "Sugar and butter are my tools, but wonder is what I serve on every plate.",
    specialty: "Handcrafted chocolate sculptures & afternoon tea collections",
    avatar: "https://images.unsplash.com/photo-1583336137348-82bc11c031ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 4,
    badge: "🍰",
  },
  {
    id: "s10",
    name: "David Okafor",
    role: "Fitness & Lifestyle Coach",
    department: "Wellness & Spa",
    quote: "Vitality is the greatest souvenir. I help guests leave feeling stronger than they arrived.",
    specialty: "Personalised wellness programmes & sunrise rooftop yoga sessions",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 3,
    badge: "🏋️",
  },
  {
    id: "s11",
    name: "Natasha Volkov",
    role: "Head of Housekeeping",
    department: "Rooms & Interiors",
    quote: "A perfectly prepared room is a silent greeting. Every fold, every detail, is a welcome.",
    specialty: "Turndown rituals, floral arrangements & suite personalisation",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 12,
    badge: "🌸",
  },
  {
    id: "s12",
    name: "Ali Hassan",
    role: "Head Barista & Bar Manager",
    department: "Lounge & Bar",
    quote: "A morning coffee or a midnight cocktail — each cup is a conversation I look forward to.",
    specialty: "Specialty single-origin coffee rituals & bespoke cocktail crafting",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 6,
    badge: "☕",
  },
  {
    id: "s13",
    name: "Elena Vasquez",
    role: "Cultural Experience Guide",
    department: "Guest Experiences",
    quote: "The city beyond our doors holds stories only locals know. I am your key to all of them.",
    specialty: "Hidden heritage walks, private gallery visits & curated food trails",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 5,
    badge: "🗺️",
  },
  {
    id: "s14",
    name: "Pierre Laurent",
    role: "Maître d'Hôtel",
    department: "Fine Dining",
    quote: "Dining is theatre. I ensure every performance is flawless from first course to last.",
    specialty: "Table ceremonials, tasting menu orchestration & guest preference curation",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 10,
    badge: "🍽️",
  },
  {
    id: "s15",
    name: "Yuki Shimada",
    role: "Interior & Ambiance Designer",
    department: "Guest Experience",
    quote: "Beauty is not decoration — it is the atmosphere that makes you never want to leave.",
    specialty: "Seasonal suite styling, scent design & immersive room theming",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    yearsAtHotel: 7,
    badge: "✨",
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 180, damping: 18 },
  },
};

// ─── Profile Card (Tooltip) ───────────────────────────────────────────────────
const ProfileCard: React.FC<{ member: StaffMember }> = ({ member }) => (
  <motion.div
    role="tooltip"
    initial={{ opacity: 0, scale: 0.85, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: -12 }}
    exit={{ opacity: 0, scale: 0.9, y: 10 }}
    transition={{ type: "spring", stiffness: 380, damping: 26 }}
    className="absolute bottom-full left-1/2 z-[100] w-72 pointer-events-none"
    style={{
      transform: "translateX(-50%)",
      transformOrigin: "bottom center",
      filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.55))",
    }}
  >
    <div
      style={{
        background: "linear-gradient(145deg, #1c1410, #2a1d12)",
        border: "1px solid rgba(196,146,42,0.3)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Cover */}
      <div style={{ height: 80, position: "relative", overflow: "hidden" }}>
        <img
          src={member.coverImage}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, rgba(28,20,16,0.95))",
          }}
        />
        {/* Badge */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontSize: 22,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        >
          {member.badge}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 18px 18px" }}>
        {/* Avatar overlap */}
        <div style={{ marginTop: -28, marginBottom: 10, position: "relative", zIndex: 10 }}>
          <img
            src={member.avatar}
            alt={member.name}
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              border: "3px solid rgba(196,146,42,0.6)",
              objectFit: "cover",
            }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#f5e9d0",
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.2,
              marginBottom: 2,
            }}
          >
            {member.name}
          </div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.35em",
              color: "#c4922a",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
            }}
          >
            {member.role} · {member.department}
          </div>
        </div>

        {/* Quote */}
        <div
          style={{
            padding: "10px 12px",
            background: "rgba(196,146,42,0.08)",
            borderLeft: "2px solid rgba(196,146,42,0.5)",
            borderRadius: "0 8px 8px 0",
            marginBottom: 10,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "rgba(245,233,208,0.75)",
              fontStyle: "italic",
              lineHeight: 1.6,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
          >
            "{member.quote}"
          </p>
        </div>

        {/* Specialty */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <span style={{ fontSize: 9, color: "#c4922a", marginTop: 1 }}>✦</span>
          <p
            style={{
              fontSize: 10,
              color: "rgba(196,146,42,0.7)",
              lineHeight: 1.5,
              fontFamily: "Georgia, serif",
            }}
          >
            {member.specialty}
          </p>
        </div>

        {/* Years */}
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid rgba(196,146,42,0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 9, color: "rgba(245,233,208,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
            With us
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#c4922a", fontFamily: "'Playfair Display', serif" }}>
            {member.yearsAtHotel} {member.yearsAtHotel === 1 ? "year" : "years"}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          bottom: -7,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: 14,
          height: 14,
          background: "#1c1410",
          borderBottom: "1px solid rgba(196,146,42,0.3)",
          borderRight: "1px solid rgba(196,146,42,0.3)",
        }}
      />
    </div>
  </motion.div>
);

// ─── Avatar Item ──────────────────────────────────────────────────────────────
const AvatarItem: React.FC<{ member: StaffMember; size: number; gap: number }> = ({
  member,
  size,
  gap,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      style={{ position: "relative", width: size, height: size, marginRight: gap, zIndex: hovered ? 60 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        aria-label={`View profile of ${member.name}`}
        whileHover={{ scale: 1.18 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: hovered ? "3px solid #c4922a" : "3px solid rgba(196,146,42,0.25)",
          overflow: "hidden",
          cursor: "pointer",
          background: "#2a1d12", // Fallback background color
          boxShadow: hovered
            ? "0 0 0 4px rgba(196,146,42,0.15), 0 8px 32px rgba(0,0,0,0.5)"
            : "0 4px 16px rgba(0,0,0,0.4)",
          transition: "border-color 0.25s, box-shadow 0.25s",
          position: "relative",
          display: "block",
        }}
      >
        <img
          src={member.avatar}
          alt={member.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
        {/* Gold shimmer overlay on hover */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 30%, rgba(196,146,42,0.18), transparent 70%)",
              pointerEvents: "none",
            }}
          />
        )}
      </motion.button>

      {/* Badge bubble */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#2a1d12,#1c1410)",
          border: "2px solid rgba(196,146,42,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          zIndex: 2,
        }}
      >
        {member.badge}
      </div>

      <AnimatePresence>{hovered && <ProfileCard member={member} />}</AnimatePresence>
    </motion.div>
  );
};

// ─── Hex Grid Layout ──────────────────────────────────────────────────────────
const HexGrid: React.FC<{ staff: StaffMember[]; itemSize?: number; gap?: number }> = ({
  staff,
  itemSize = 72,
  gap = 20,
}) => {
  const [columns, setColumns] = useState(5);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const w = Math.min(window.innerWidth - 48, 900);
      const cols = Math.max(3, Math.min(8, Math.floor(w / (itemSize + gap))));
      setColumns(cols);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [itemSize, gap]);

  const sin60 = 0.866;
  const effectiveH = (itemSize + gap) * sin60;
  const negMargin = -(itemSize - effectiveH + gap * (1 - sin60));

  const rows = useMemo(() => {
    const result: { items: StaffMember[]; even: boolean }[] = [];
    let i = 0;
    let even = true;
    while (i < staff.length) {
      const cap = even ? columns : Math.max(columns - 1, 1);
      const chunk = staff.slice(i, i + cap);
      if (chunk.length > 0) result.push({ items: chunk, even });
      i += cap;
      even = !even;
    }
    return result;
  }, [staff, columns]);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
    >
      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: ri > 0 ? negMargin : 0,
            paddingLeft: !row.even ? (itemSize + gap) / 2 : 0,
          }}
        >
          {row.items.map((m) => (
            <AvatarItem key={m.id} member={m} size={itemSize} gap={gap} />
          ))}
        </div>
      ))}
    </motion.div>
  );
};

// ─── Ornament ─────────────────────────────────────────────────────────────────
const GoldLine: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 340, margin: "0 auto" }}>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,rgba(196,146,42,0.6))" }} />
    <span style={{ color: "#c4922a", fontSize: 14 }}>✦</span>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(to left,transparent,rgba(196,146,42,0.6))" }} />
  </div>
);

// ─── Main Export ──────────────────────────────────────────────────────────────
const HotelStaffGrid: React.FC = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 0%, #2a1a08 0%, #100a04 40%, #080500 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "72px 24px 80px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        overflowX: "hidden",
      }}
    >
      {/* ── Hero Copy ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ textAlign: "center", maxWidth: 680, marginBottom: 56 }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.55em",
            color: "#c4922a",
            textTransform: "uppercase",
            marginBottom: 20,
            fontFamily: "Georgia, serif",
          }}
        >
          · The People Behind Your Perfection ·
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 54px)",
            fontWeight: 700,
            color: "#f5e9d0",
            lineHeight: 1.15,
            fontFamily: "'Playfair Display', Georgia, serif",
            marginBottom: 8,
          }}
        >
          Devoted Hearts,{" "}
          <span style={{ color: "#c4922a", fontStyle: "italic" }}>Exceptional Hands</span>
        </h1>
        <h2
          style={{
            fontSize: "clamp(14px, 2vw, 18px)",
            fontWeight: 400,
            color: "rgba(245,233,208,0.55)",
            fontStyle: "italic",
            marginBottom: 32,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
          }}
        >
          Where every member of our family exists solely to elevate yours.
        </h2>

        <GoldLine />

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            marginTop: 28,
            fontSize: "clamp(14px, 1.8vw, 17px)",
            color: "rgba(245,233,208,0.6)",
            lineHeight: 1.85,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
          }}
        >
          From the first breath of your morning coffee to the final fold of your evening turndown,
          our staff do not simply work here — they{" "}
          <em style={{ color: "rgba(196,146,42,0.85)" }}>live</em> for the moments that transform
          a stay into a story worth telling for decades. Hover over any portrait to meet the person
          who will make your stay unforgettable.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(24px,5vw,56px)",
            marginTop: 40,
            paddingTop: 32,
            borderTop: "1px solid rgba(196,146,42,0.15)",
          }}
        >
          {[
            { num: "15", label: "Specialists" },
            { num: "6", label: "Departments" },
            { num: "98+", label: "Combined Years" },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "clamp(26px,4vw,38px)",
                  fontWeight: 900,
                  color: "#c4922a",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "0.35em",
                  color: "rgba(245,233,208,0.4)",
                  textTransform: "uppercase",
                  marginTop: 4,
                  fontFamily: "Georgia, serif",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Hex Grid ── */}
      <div style={{ width: "100%", maxWidth: 860 }}>
        <HexGrid staff={STAFF} itemSize={72} gap={22} />
      </div>

      {/* ── Footer note ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{ marginTop: 56, textAlign: "center" }}
      >
        <GoldLine />
        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            color: "rgba(196,146,42,0.45)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
          }}
        >
          Hover any portrait · Meet the soul behind the service
        </p>
      </motion.div>
    </main>
  );
};

export default HotelStaffGrid;
