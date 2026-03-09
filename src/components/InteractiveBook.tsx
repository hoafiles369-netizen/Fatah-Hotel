import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";

/* ── palette ────────────────────────────────────────────────────────────────── */
const G = {
  gold:      "#c9a84c",
  goldLight: "#f0d080",
  goldDeep:  "#8a6820",
  goldGlow:  "#e8b84b",
  black:     "#000000",
  nearBlack: "#0a0800",
  richBlack: "#080600",
};

/* ── keyframe CSS injected once ─────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600&display=swap');

  @keyframes pulseGlow {
    0%,100% { opacity:.7; transform:scale(1); }
    50%      { opacity:1;  transform:scale(1.04); }
  }
  @keyframes floatBook {
    0%,100% { transform:translateY(0px) rotateX(2deg); }
    50%      { transform:translateY(-10px) rotateX(4deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes orbPulse {
    0%,100% { transform:scale(1);   opacity:.18; }
    50%      { transform:scale(1.3); opacity:.32; }
  }
  @keyframes particleDrift {
    0%   { transform:translateY(0)   translateX(0)   opacity:0; }
    10%  { opacity:.9; }
    90%  { opacity:.6; }
    100% { transform:translateY(-120px) translateX(20px) opacity:0; }
  }
  @keyframes cornerPulse {
    0%,100% { opacity:.5; }
    50%      { opacity:1; }
  }
  .book-float { animation: floatBook 5s ease-in-out infinite; }
  .corner-pulse { animation: cornerPulse 2.5s ease-in-out infinite; }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    .book-float { animation-duration: 7s; } /* Slower animation on mobile to save GPU */
  }
`;

function injectCSS() {
  if (document.getElementById("ib-styles")) return;
  const s = document.createElement("style");
  s.id = "ib-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ── helpers ─────────────────────────────────────────────────────────────────── */
const faceStyle: React.CSSProperties = {
  position: "absolute", inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  backgroundColor: "#0d0900",
  overflow: "hidden",
  transform: "translateZ(0)", // Force hardware acceleration
};
const imgStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

/* ── Floating gold particles ─────────────────────────────────────────────────── */
const Particles = React.memo(function Particles() {
  // Reduced particle count for better performance, especially on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 8 : 18;
  
  const dots = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    bottom: `${Math.random() * 30}%`,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 3,
  })), [count]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", contain: "strict" }}>
      {dots.map(d => (
        <div key={d.id} style={{
          position: "absolute",
          left: d.left, bottom: d.bottom,
          width: d.size, height: d.size,
          borderRadius: "50%",
          background: G.goldLight,
          boxShadow: `0 0 ${d.size * 2}px ${G.goldGlow}`,
          animation: `particleDrift ${d.duration}s ${d.delay}s ease-in infinite`,
          willChange: "transform, opacity",
        }} />
      ))}
    </div>
  );
});

/* ── Decorative corner ornament ──────────────────────────────────────────────── */
// @ts-ignore
const Corner = React.memo(function Corner({ pos }) {
  const flip = {
    tl: "scaleX(1)  scaleY(1)",
    tr: "scaleX(-1) scaleY(1)",
    bl: "scaleX(1)  scaleY(-1)",
    br: "scaleX(-1) scaleY(-1)",
  }[pos as "tl" | "tr" | "bl" | "br"];
  const placement = {
    tl: { top: 12, left: 12 },
    tr: { top: 12, right: 12 },
    bl: { bottom: 12, left: 12 },
    br: { bottom: 12, right: 12 },
  }[pos as "tl" | "tr" | "bl" | "br"];
  return (
    // @ts-ignore
    <div className="corner-pulse" style={{ position: "absolute", ...placement, transform: flip, lineHeight: 1 }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M2 2 L2 14 M2 2 L14 2" stroke={G.goldLight} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="2" cy="2" r="2" fill={G.goldGlow}/>
        <path d="M8 8 L8 14 M8 8 L14 8" stroke={G.gold} strokeWidth="1" strokeLinecap="round" opacity=".6"/>
      </svg>
    </div>
  );
});

/* ── Spine gradient overlay ──────────────────────────────────────────────────── */
const SpineGrad = React.memo(({ reverse = false }: { reverse?: boolean }) => (
  <div style={{
    position: "absolute",
    [reverse ? "right" : "left"]: 0,
    top: 0, bottom: 0, width: "14%",
    background: reverse
      ? "linear-gradient(to left, rgba(0,0,0,0.25), transparent)"
      : "linear-gradient(to right, rgba(0,0,0,0.25), transparent)",
    pointerEvents: "none",
  }} />
));

/* ── Gold edge trim on pages ─────────────────────────────────────────────────── */
// @ts-ignore
const GoldEdge = React.memo(({ side }) => (
  <div style={{
    position: "absolute",
    [side]: 0, top: 0, bottom: 0,
    width: 2,
    background: `linear-gradient(to bottom, transparent, ${G.gold}, ${G.goldLight}, ${G.gold}, transparent)`,
    opacity: .7,
    pointerEvents: "none",
  }} />
));

/* ── Core InteractiveBook ────────────────────────────────────────────────────── */
interface InteractiveBookProps {
  width?: number;
  height?: number;
  frontCover?: string;
  backCover?: string;
  innerPages?: string[];
  borderRadius?: number;
  onInteract?: () => void;
}

const InteractiveBook = React.memo(function InteractiveBook({ 
  width = 300, 
  height = 420, 
  frontCover, 
  backCover, 
  innerPages = [], 
  borderRadius = 6,
  onInteract
}: InteractiveBookProps) {
  useEffect(() => { injectCSS(); }, []);

  // If no inner pages provided, create 8 blank ones for effect (ends on Page 7 on right)
  const pagesToUse = useMemo(() => innerPages.length > 0 ? innerPages : Array(8).fill(null), [innerPages]);
  
  const allImages = useMemo(() => {
    const rawImages = [frontCover, ...pagesToUse];
    // Ensure even number of leaves
    return rawImages.length % 2 === 0 ? rawImages : [...rawImages, null];
  }, [frontCover, pagesToUse]);
  
  const leafPairs = useMemo(() => {
    const pairs: (string | null)[][] = [];
    for (let i = 0; i < allImages.length; i += 2) {
      pairs.push([allImages[i] || null, allImages[i + 1] || null]);
    }
    return pairs;
  }, [allImages]);

  const totalLeaves = leafPairs.length;

  const [flippedCount, setFlippedCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const animatingRef = useRef(false);
  const flippedRef   = useRef(0);

  // We need enough controls for the maximum likely pages
  const c = Array.from({ length: 20 }).map(() => useAnimationControls());
  const bookCtrl = useAnimationControls();

  const handleInteract = () => {
    if (onInteract) onInteract();
  };

  const flipForward = async () => {
    if (animatingRef.current) return;
    handleInteract();
    const cur = flippedRef.current;
    animatingRef.current = true;

    // Close book if we are at the last leaf (clicking the last page)
    if (cur >= totalLeaves - 1) {
      bookCtrl.start({ x: 0, transition: { duration: .8, ease: "easeInOut" } });
      // Flip back all flipped pages
      for (let i = cur - 1; i >= 0; i--) {
        c[i].start({ rotateY: 0, transition: { duration: .5, ease: "easeInOut" } });
        await new Promise(r => setTimeout(r, 60));
      }
      flippedRef.current = 0;
      setFlippedCount(0);
      setIsOpen(false);
      animatingRef.current = false;
      return;
    }

    if (cur === 0) {
      setIsOpen(true);
      bookCtrl.start({ x: width / 2, transition: { duration: .6, ease: "easeInOut" } });
    }
    flippedRef.current = cur + 1;
    setFlippedCount(cur + 1);
    await c[cur].start({ rotateY: -180, transition: { duration: .72, ease: [.4, 0, .2, 1] } });
    animatingRef.current = false;
  };

  const flipBackward = async () => {
    if (animatingRef.current) return;
    handleInteract();
    const cur = flippedRef.current;
    if (cur === 0) return;
    animatingRef.current = true;

    const idx = cur - 1;
    flippedRef.current = cur - 1;
    setFlippedCount(cur - 1);
    await c[idx].start({ rotateY: 0, transition: { duration: .72, ease: [.4, 0, .2, 1] } });

    if (flippedRef.current === 0) {
      await bookCtrl.start({ x: 0, transition: { duration: .6, ease: "easeInOut" } });
      setIsOpen(false);
    }
    animatingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    (e.clientX - rect.left < rect.width / 2) ? flipBackward() : flipForward();
  };

  /* Gold glow shadow when open */
  const openShadow = `
    0 0 60px 12px rgba(201,168,76,0.25),
    0 0 100px 30px rgba(201,168,76,0.1),
    0 30px 80px 0 rgba(0,0,0,0.8)
  `;
  const closedShadow = `
    12px 12px 50px 0 rgba(0,0,0,0.95),
    0 0 40px 8px rgba(201,168,76,0.15),
    0 0 80px 20px rgba(201,168,76,0.08)
  `;

  // Styles for empty pages/covers
  const coverGradient = `linear-gradient(160deg, #1a1100 0%, #0d0900 60%, #1a0e00 100%)`;
  const pageGradient = `linear-gradient(to right, #fdfbf7 0%, #f2e8d5 10%, #fdfbf7 100%)`;
  const pageTexture = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

  return (
    <div
      style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center",
               alignItems: "center", perspective: 2800, overflow: "visible", cursor: "pointer", contain: "layout" }}
      onClick={handleClick}
    >
      <motion.div
        animate={bookCtrl}
        className={isOpen ? "" : "book-float"}
        style={{
          width, height,
          position: "relative",
          transformStyle: "preserve-3d",
          boxShadow: isOpen ? openShadow : closedShadow,
          borderRadius,
          willChange: "transform, box-shadow", // Hint for browser optimization
        }}
      >
        {/* Gold border ring around whole book */}
        <div style={{
          position: "absolute", inset: -1, borderRadius,
          border: `1px solid ${G.gold}`,
          opacity: .6, pointerEvents: "none", zIndex: 200,
          boxShadow: `inset 0 0 12px rgba(201,168,76,0.15)`,
        }} />

        {leafPairs.map(([frontSrc, backSrc], index) => {
          const isFlipped  = index < flippedCount;
          const isFlipping = index === flippedCount - 1 || index === flippedCount;
          const zOffset    = isFlipped ? index * .5 : (totalLeaves - index) * .5;
          const zIndex     = isFlipping ? 100 : isFlipped ? index : totalLeaves - index;

          // Determine if this leaf is a cover (first or last)
          const isFrontCover = index === 0;
          const isBackCover = index === totalLeaves - 1;
          const isCover = isFrontCover; // Only front cover is treated as cover now

          return (
            <motion.div
              key={index}
              animate={c[index]}
              initial={{ rotateY: 0 }}
              style={{
                position: "absolute", inset: 0,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                zIndex,
                transform: `translateZ(${zOffset}px)`,
                willChange: "transform", // Critical for smooth animation
              }}
            >
              {/* ── Front face ── */}
              <div style={{ ...faceStyle, borderRadius: `0 ${borderRadius}px ${borderRadius}px 0` }}>
                {frontSrc ? (
                  <img 
                    src={frontSrc} 
                    style={{ ...imgStyle, filter: "brightness(.88) contrast(1.08) saturate(.9)" }} 
                    alt="" 
                    loading={isFrontCover ? "eager" : "lazy"}
                    width={width}
                    height={height}
                    decoding="async"
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: isCover ? coverGradient : pageGradient }}>
                    {!isCover && <div style={{ position: "absolute", inset: 0, backgroundImage: pageTexture, opacity: 0.5 }} />}
                    {isFrontCover && (
                      <div style={{ 
                        height: "100%", display: "flex", flexDirection: "column", 
                        alignItems: "center", justifyContent: "center", padding: 20,
                        border: `2px solid ${G.gold}`, margin: 12, borderRadius: 4
                      }}>
                        <div style={{ color: G.gold, fontSize: 24, marginBottom: 8 }}>✦</div>
                        <div style={{ color: G.gold, fontFamily: "Cinzel Decorative", fontSize: 28, textAlign: "center" }}>
                          FATAH<br/>CHRONICLES
                        </div>
                        <div style={{ width: 40, height: 1, background: G.gold, margin: "16px 0" }} />
                        <div style={{ color: G.goldLight, fontSize: 12, letterSpacing: 2 }}>VOL. {index + 1}</div>
                      </div>
                    )}
                    {!isCover && (
                      <div style={{ padding: 30, color: G.nearBlack, fontFamily: "Cormorant Garamond", fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
                        <div style={{ textAlign: "center", marginBottom: 20, fontSize: 18, fontStyle: "italic" }}>Page {index * 2 - 1}</div>
                        <p>A legacy of elegance and taste, curated for the discerning traveler.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* gold page tint overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%)",
                  pointerEvents: "none",
                }} />
                <SpineGrad />
                <GoldEdge side="right" />
              </div>

              {/* ── Back face ── */}
              <div style={{
                ...faceStyle,
                transform: "rotateY(180deg) translateZ(0.01px)",
                borderRadius: `${borderRadius}px 0 0 ${borderRadius}px`,
              }}>
                {backSrc ? (
                  <img 
                    src={backSrc} 
                    style={{ ...imgStyle, filter: "brightness(.88) contrast(1.08) saturate(.9)" }} 
                    alt="" 
                    loading="lazy"
                    width={width}
                    height={height}
                    decoding="async"
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: pageGradient }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: pageTexture, opacity: 0.5 }} />
                    <div style={{ padding: 30, color: G.nearBlack, fontFamily: "Cormorant Garamond", fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
                      <div style={{ textAlign: "center", marginBottom: 20, fontSize: 18, fontStyle: "italic" }}>Page {index * 2}</div>
                      <p>Experience the warmth that lingers long after you leave.</p>
                      {isBackCover && (
                        <div style={{ textAlign: "center", marginTop: 40, color: G.goldDeep }}>❦</div>
                      )}
                    </div>
                  </div>
                )}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%)",
                  pointerEvents: "none",
                }} />
                <SpineGrad reverse />
                <GoldEdge side="left" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});

/* ── App shell ───────────────────────────────────────────────────────────────── */
// Import all book images (png/jpg/jpeg)
const BOOK_ASSETS = {
  ...import.meta.glob('../assets/books/**/*.png', { eager: true, import: 'default' }),
  ...import.meta.glob('../assets/books/**/*.jpg', { eager: true, import: 'default' }),
  ...import.meta.glob('../assets/books/**/*.jpeg', { eager: true, import: 'default' }),
};

function getBookImages(bookId: string) {
  const coverKey = `../assets/books/${bookId}/cover.png`;
  const frontCover = BOOK_ASSETS[coverKey] as string | undefined;

  // Find all pages for this book
  const pageKeys = Object.keys(BOOK_ASSETS).filter(k => 
    k.startsWith(`../assets/books/${bookId}/page`) &&
    (k.endsWith('.png') || k.endsWith('.jpg') || k.endsWith('.jpeg'))
  );

  // Sort them naturally (page1, page2, ... page10)
  pageKeys.sort((a, b) => {
    const numA = parseInt(a.match(/page(\d+)\.(png|jpg|jpeg)$/)?.[1] || '0');
    const numB = parseInt(b.match(/page(\d+)\.(png|jpg|jpeg)$/)?.[1] || '0');
    return numA - numB;
  });

  const innerPages = pageKeys.map(k => BOOK_ASSETS[k] as string);

  return { frontCover, innerPages };
}

const BOOKS_DATA = [
  { id: 'book1', title: 'Services' },
  { id: 'book2', title: 'Dining' },
  { id: 'book3', title: 'Experience' },
];

export default function BookSection() {
  useEffect(() => { injectCSS(); }, []);
  const [activeBook, setActiveBook] = useState<number | null>(null);

  // Responsive scale for mobile
  const [scale, setScale] = useState(1);
  const [gap, setGap] = useState("2rem");
  
  useEffect(() => {
    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (window.innerWidth < 500) {
          setScale(0.75);
          setGap("1rem");
        } else if (window.innerWidth < 800) {
          setScale(0.85);
          setGap("1.5rem");
        } else {
          setScale(1);
          setGap("2rem");
        }
      });
    };
    
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section style={{
      minHeight: "80vh",
      background: G.richBlack,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      fontFamily: "'Cinzel', serif",
      padding: "6rem 1rem",
    }}>

      {/* ── deep radial glow behind the book ── */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "100%", height: "100%",
        background: `radial-gradient(circle, rgba(201,168,76,0.1) 0%, rgba(138,104,32,0.05) 40%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* ── floor reflection ── */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "35%",
        background: `linear-gradient(to top, rgba(201,168,76,0.04) 0%, transparent 100%)`,
        pointerEvents: "none",
      }} />

      {/* ── ambient grid lines ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* ── floating particles ── */}
      <Particles />

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: "3rem", zIndex: 10, padding: "0 1rem" }}>
        <h2 style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          color: G.gold,
          marginBottom: "1rem",
          textShadow: `0 0 20px ${G.goldDeep}`
        }}>
          Our Chronicles
        </h2>
        <p style={{ color: G.goldLight, opacity: 0.7, maxWidth: 600, margin: "0 auto", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Explore our stories, menus, and history through these interactive volumes.
        </p>
      </div>

      {/* ── Books Grid ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap,
        width: "100%",
        maxWidth: 1400,
        zIndex: 10,
      }}>
        {BOOKS_DATA.map((book, i) => {
          const { frontCover, innerPages } = getBookImages(book.id);
          
          return (
            <div 
              key={book.id}
              onMouseEnter={() => setActiveBook(i)}
              onMouseLeave={() => setActiveBook(null)}
              style={{
                width: 300, height: 420,
                perspective: 2800,
                // Scale down on mobile to fit
                transform: `scale(${scale})`,
                // Ensure active book is on top
                zIndex: activeBook === i ? 50 : 10,
                transition: "z-index 0s linear 0.1s", // delay z-index drop slightly
                position: "relative",
              }}
            >
              <InteractiveBook
                width={300}
                height={420}
                borderRadius={6}
                frontCover={frontCover}
                innerPages={innerPages}
                onInteract={() => setActiveBook(i)}
              />
              {/* Optional Label below book */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '1.5rem', 
                color: G.gold, 
                opacity: 0.8,
                fontSize: '0.9rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                pointerEvents: 'none'
              }}>
                {book.title}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
