import { useState, useCallback, CSSProperties } from "react";

const LAYOUTS: Record<string, { label: string; getTransform: (i: number, total: number, active: number) => CSSProperties }> = {
  fan: {
    label: "Fan",
    getTransform: (i, total, active) => {
      const isActive = i === active;
      const spread = 18;
      const offset = i - (total - 1) / 2;
      return {
        rotate: isActive ? 0 : `${offset * spread}deg`,
        x: isActive ? 0 : offset * 12,
        y: isActive ? -24 : Math.abs(offset) * 6,
        scale: isActive ? 1.06 : 0.92,
        zIndex: isActive ? total + 1 : i,
      };
    },
  },
  stack: {
    label: "Stack",
    getTransform: (i, total, active) => {
      const isActive = i === active;
      const fromTop = total - 1 - i;
      return {
        rotate: isActive ? 0 : `${(i % 2 === 0 ? 1 : -1) * fromTop * 2.5}deg`,
        x: isActive ? 0 : (i % 2 === 0 ? 1 : -1) * fromTop * 3,
        y: isActive ? -28 : fromTop * -4,
        scale: isActive ? 1.06 : 1 - fromTop * 0.03,
        zIndex: isActive ? total + 1 : i,
      };
    },
  },
  cascade: {
    label: "Cascade",
    getTransform: (i, total, active) => {
      const isActive = i === active;
      return {
        rotate: isActive ? 0 : 0,
        x: isActive ? 0 : (i - (total - 1) / 2) * 28,
        y: isActive ? -28 : (total - 1 - i) * -8,
        scale: isActive ? 1.06 : 1 - (total - 1 - i) * 0.04,
        zIndex: isActive ? total + 1 : i,
      };
    },
  },
  spread: {
    label: "Spread",
    getTransform: (i, total, active) => {
      const isActive = i === active;
      const offset = i - (total - 1) / 2;
      return {
        rotate: isActive ? 0 : 0,
        x: isActive ? 0 : offset * 52,
        y: isActive ? -28 : 0,
        scale: isActive ? 1.06 : 0.95,
        zIndex: isActive ? total + 1 : i,
      };
    },
  },
};

const CARDS = [
  {
    id: 0,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    label: "The Royal Burger",
    sub: "Signature Beef Blend",
    accent: "#e94560",
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    label: "Prime Steak",
    sub: "Dry Aged 45 Days",
    accent: "#a855f7",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    label: "Spicy Shrimp",
    sub: "Coastal Flavors",
    accent: "#22c55e",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    label: "Golden Pancakes",
    sub: "Breakfast All Day",
    accent: "#f59e0b",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    label: "Smoked Ribs",
    sub: "Hickory Wood Smoked",
    accent: "#ef4444",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356f36?auto=format&fit=crop&w=800&q=80",
    label: "Classic Curry",
    sub: "Spice Blend",
    accent: "#06b6d4",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
    label: "Classic Caesar",
    sub: "Crisp Romaine & Parmesan",
    accent: "#84cc16",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    label: "Glazed Pork Belly",
    sub: "Slow Roasted & Crispy",
    accent: "#f97316",
  },
];

interface CardProps {
  card: typeof CARDS[0];
  index: number;
  total: number;
  active: number;
  layout: string;
  size: number;
  shadowIntensity: number;
  onClick: (index: number) => void;
}

function Card({ card, index, total, active, layout, size, shadowIntensity, onClick }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const t = LAYOUTS[layout].getTransform(index, total, active);
  const isActive = index === active;

  // Type assertion for transform properties to handle string/number differences
  const scaleVal = (t.scale as number);
  const scale = hovered && !isActive ? scaleVal + 0.03 : scaleVal;
  
  const yVal = (t.y as number);
  const y = hovered && !isActive ? yVal - 10 : yVal;

  const w = 220 * size;
  const h = 300 * size;

  const shadow = isActive
    ? `0 ${32 * shadowIntensity}px ${64 * shadowIntensity}px rgba(0,0,0,${0.6 * shadowIntensity}), 0 0 0 1px rgba(255,255,255,0.06)`
    : `0 ${8 * shadowIntensity}px ${24 * shadowIntensity}px rgba(0,0,0,${0.4 * shadowIntensity})`;

  return (
    <div
      onClick={() => onClick(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        width: w,
        height: h,
        borderRadius: 18 * size,
        background: "#1a1a1a",
        backgroundImage: `url("${card.image}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: shadow,
        cursor: isActive ? "default" : "pointer",
        transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${y}px)) rotate(${t.rotate}) scale(${scale})`,
        transformOrigin: "center bottom",
        transition: `transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease`,
        willChange: "transform",
        zIndex: t.zIndex,
        left: "50%",
        top: "50%",
        overflow: "hidden",
        border: isActive ? `1px solid rgba(255,255,255,0.12)` : "1px solid rgba(255,255,255,0.05)",
        userSelect: "none",
      }}
    >
      {/* Noise overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.4, mixBlendMode: "overlay", pointerEvents: "none",
      }} />

      {/* Gradient Overlay for Text Readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Sheen */}
      <div style={{
        position: "absolute", inset: 0,
        background: isActive
          ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />

      {/* Bottom label area */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: `${16 * size}px ${20 * size}px`,
      }}>
        {/* Accent bar */}
        <div style={{
          width: 32 * size, height: 2 * size,
          background: card.accent,
          borderRadius: 2,
          marginBottom: 8 * size,
          opacity: isActive ? 1 : 0.6,
          transition: "opacity 0.3s",
          boxShadow: `0 0 ${8 * size}px ${card.accent}88`,
        }} />
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 16 * size,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "0.01em",
          lineHeight: 1.2,
          textShadow: "0 1px 8px rgba(0,0,0,0.6)",
        }}>{card.label}</div>
        <div style={{
          fontFamily: "'DM Mono', 'Courier New', monospace",
          fontSize: 9 * size,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginTop: 4 * size,
        }}>{card.sub}</div>
      </div>

      {/* Card number */}
      <div style={{
        position: "absolute", top: 16 * size, right: 18 * size,
        fontFamily: "'DM Mono', monospace",
        fontSize: 10 * size,
        color: "rgba(255,255,255,0.6)",
        letterSpacing: "0.1em",
        background: "rgba(0,0,0,0.4)",
        padding: "2px 6px",
        borderRadius: 4,
        backdropFilter: "blur(4px)",
      }}>0{card.id + 1}</div>
    </div>
  );
}

export default function CardStack() {
  const layout = "fan";
  const [active, setActive] = useState(CARDS.length - 1);
  const size = 1;
  const shadowIntensity = 1;

  const handleCardClick = useCallback((index: number) => {
    if (index !== active) setActive(index);
  }, [active]);

  const stageH = 380;

  return (
    <div style={{
      width: "100%",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      position: "relative",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 480 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#C9A96E",
          marginBottom: 12,
        }}>Interactive Menu</div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(28px, 5vw, 44px)",
          fontWeight: 700,
          color: "#FAF7F2",
          margin: 0,
          lineHeight: 1.1,
        }}>Chef's Selection</h2>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 14,
          color: "rgba(250,247,242,0.6)",
          margin: "12px 0 0",
          fontWeight: 300,
          lineHeight: 1.6,
        }}>Explore our signature dishes. Click any card to bring it forward.</p>
      </div>

      {/* Stage */}
      <div className="card-stack-stage" style={{
        position: "relative",
        width: "100%",
        maxWidth: 560,
        height: stageH,
        marginBottom: 32,
      }}>
        {CARDS.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            index={i}
            total={CARDS.length}
            active={active}
            layout={layout}
            size={size}
            shadowIntensity={shadowIntensity}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 8, marginBottom: 36 }}>
        {CARDS.map((card, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === active ? card.accent : "rgba(255,255,255,0.18)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: i === active ? `0 0 8px ${card.accent}88` : "none",
            }}
            aria-label={`Select card ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        
        .card-stack-stage {
          transform: scale(0.85);
          transform-origin: center top;
        }
        @media (min-width: 640px) {
          .card-stack-stage { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
