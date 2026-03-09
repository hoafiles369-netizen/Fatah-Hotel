// @ts-nocheck
import React, { useState, useRef, useCallback, useEffect } from "react";

// ─── Avatars ──────────────────────────────────────────────────────────────────
const AVATARS: Record<string, string> = {
  Olivia: "https://randomuser.me/api/portraits/women/44.jpg",
  Sarah:  "https://randomuser.me/api/portraits/women/68.jpg",
  Jordan: "https://randomuser.me/api/portraits/men/32.jpg",
  Emma:   "https://randomuser.me/api/portraits/women/21.jpg",
  Ryan:   "https://randomuser.me/api/portraits/men/75.jpg",
  Taylor: "https://randomuser.me/api/portraits/women/90.jpg",
  Alex:   "https://randomuser.me/api/portraits/men/51.jpg",
};

// ─── Themes ───────────────────────────────────────────────────────────────────
const THEMES: Record<string, { bg: string; glow: string }> = {
  "dark-teal":     { bg:"linear-gradient(140deg,#0b2e2e,#0d3d3d 60%,#0a2828)", glow:"13,148,136"  },
  "purple":        { bg:"linear-gradient(140deg,#5b21b6,#7c3aed 50%,#6d28d9)", glow:"168,85,247"  },
  "teal-wave":     { bg:"linear-gradient(140deg,#134e4a,#0f766e 55%,#115e59)", glow:"45,212,191"  },
  "blue-gradient": { bg:"linear-gradient(140deg,#1e3a8a,#1d4ed8 50%,#0284c7)", glow:"56,189,248"  },
  "green":         { bg:"linear-gradient(140deg,#3f6212,#65a30d 60%,#84cc16)", glow:"163,230,53"  },
  "white":         { bg:"#ffffff",                                               glow:"148,163,184" },
  "black":         { bg:"linear-gradient(140deg,#0d0d0d,#1c1c1c)",              glow:"100,116,139" },
};

// ─── Card data (x,y = fraction of canvas half-size) ──────────────────────────
const CARDS = [
  { id:1, name:"Olivia", rating:5, text:"The attention to detail really shows. It adds personality without distracting from the content.", bg:"dark-teal",     textColor:"#fff", x:-0.30, y:-0.22, rotate:-6  },
  { id:2, name:"Sarah",  rating:4, text:"Easy to use, beautifully animated, and very flexible. Exactly what I was looking for.",           bg:"purple",        textColor:"#fff", x:-0.05, y:-0.30, rotate: 5  },
  { id:3, name:"Jordan", rating:5, text:"Game changer for my workflow. Highly recommend.",                                                  bg:"teal-wave",     textColor:"#fff", x: 0.28, y:-0.22, rotate: 7  },
  { id:4, name:"Emma",   rating:5, text:"Clean, modern, and reliable. Clients notice it immediately and always ask how it was built.",      bg:"blue-gradient", textColor:"#fff", x:-0.30, y: 0.10, rotate:-5  },
  { id:5, name:"Ryan",   rating:4, text:"Animations feel natural and responsive. This saved me hours of custom motion work.",               bg:"green",         textColor:"#fff", x: 0.23, y: 0.08, rotate: 4  },
  { id:6, name:"Taylor", rating:5, text:"Exceeded all my expectations. Five stars.",                                                        bg:"white",         textColor:"#111", x:-0.12, y: 0.27, rotate:-7  },
  { id:7, name:"Alex",   rating:5, text:"Absolutely love this! Best decision ever.",                                                        bg:"black",         textColor:"#fff", x: 0.12, y: 0.30, rotate:-2  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUND CANVAS — animated aurora orbs + star field
// Runs entirely outside React on its own RAF loop
// ═══════════════════════════════════════════════════════════════════════════════
function BackgroundCanvas({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, raf: number | null = null;

    // ── Orbs (aurora blobs) ────────────────────────────────────────────────
    const ORBS = [
      { x:0.15, y:0.20, r:0.38, color:[99,102,241],  speed:0.00018, phase:0.0  },
      { x:0.80, y:0.15, r:0.30, color:[139,92,246],  speed:0.00022, phase:1.2  },
      { x:0.85, y:0.75, r:0.35, color:[6,182,212],   speed:0.00015, phase:2.5  },
      { x:0.20, y:0.80, r:0.28, color:[16,185,129],  speed:0.00020, phase:4.0  },
      { x:0.50, y:0.50, r:0.22, color:[236,72,153],  speed:0.00025, phase:3.1  },
    ];

    // ── Stars ──────────────────────────────────────────────────────────────
    const STAR_COUNT = 110;
    interface Star { x: number; y: number; r: number; a: number; tw: number; ts: number; }
    let stars: Star[] = [];
    const initStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.1 + 0.2,
        a: Math.random() * 0.5 + 0.15,
        tw: Math.random() * Math.PI * 2,
        ts: 0.0004 + Math.random() * 0.0008,
      }));
    };

    // ── Grid dots ─────────────────────────────────────────────────────────
    const GRID = 52;

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      W = rect ? rect.width  : window.innerWidth;
      H = rect ? rect.height : window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      initStars();
    };

    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    resize();

    // ── Render loop ────────────────────────────────────────────────────────
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      // 1. Aurora orbs — large radial gradients with feather
      ORBS.forEach(o => {
        const ox = (o.x + 0.06 * Math.sin(t * o.speed + o.phase))       * W;
        const oy = (o.y + 0.06 * Math.cos(t * o.speed * 0.7 + o.phase)) * H;
        const radius = o.r * Math.min(W, H);
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius);
        const [r,g2,b] = o.color;
        g.addColorStop(0,   `rgba(${r},${g2},${b},0.18)`);
        g.addColorStop(0.4, `rgba(${r},${g2},${b},0.08)`);
        g.addColorStop(1,   `rgba(${r},${g2},${b},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Subtle dot grid
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      for (let gx = GRID/2; gx < W; gx += GRID) {
        for (let gy = GRID/2; gy < H; gy += GRID) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Stars with twinkle
      stars.forEach(s => {
        s.tw += s.ts;
        const alpha = s.a * (0.5 + 0.5 * Math.sin(s.tw));
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={cvs}
      style={{
        position:"absolute", inset:0,
        width:"100%", height:"100%",
        pointerEvents:"none",
        zIndex:0,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STARS RATING
// ═══════════════════════════════════════════════════════════════════════════════
function Stars({ rating, light }: { rating: number; light: boolean }) {
  return (
    <div style={{ display:"flex", gap:2, marginBottom:8 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
          fill={s<=rating?"#facc15":"none"}
          stroke={s<=rating?"#facc15": light?"rgba(0,0,0,0.2)":"rgba(255,255,255,0.22)"}
          strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AVATAR
// ═══════════════════════════════════════════════════════════════════════════════
const FALLBACKS = ["#a78bfa","#f472b6","#34d399","#fb923c","#60a5fa","#818cf8","#f87171"];

function Avatar({ name, idx }: { name: string; idx: number }) {
  const [ok,  setOk]  = useState(false);
  const [err, setErr] = useState(false);
  return (
    <div style={{
      width:32, height:32, borderRadius:"50%",
      background:FALLBACKS[idx % FALLBACKS.length],
      overflow:"hidden", flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:12, fontWeight:700, color:"#fff",
    }}>
      {!err && (
        <img src={AVATARS[name]} alt={name}
          onLoad={()=>setOk(true)} onError={()=>setErr(true)}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:ok?"block":"none" }}
        />
      )}
      {(!ok||err) && name[0]}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD  — all interaction via direct DOM, zero setState during drag/glide
// ═══════════════════════════════════════════════════════════════════════════════
interface CardProps {
  card: typeof CARDS[0];
  idx: number;
  zIndex: number;
  onFront: (id: number) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

function Card({ card, idx, zIndex, onFront, canvasRef }: CardProps) {
  const el      = useRef<HTMLDivElement>(null);
  const pos     = useRef<{x: number, y: number} | null>(null);           // { x, y } px from center
  const vel     = useRef({ x:0, y:0 });
  const drag    = useRef(false);
  const origin  = useRef({ mx:0, my:0, cx:0, cy:0 });
  const lastPt  = useRef({ x:0, y:0, t:0 });
  const rafId   = useRef<number | null>(null);

  const theme   = THEMES[card.bg];
  const isLight = card.bg === "white";

  // ── helpers ────────────────────────────────────────────────────────────────
  const getInitial = () => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return { x:0, y:0 };
    return { x: card.x * r.width * 0.5, y: card.y * r.height * 0.5 };
  };

  const clamp = (x: number, y: number) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return { x, y };
    const hw = el.current ? el.current.offsetWidth  / 2 : 105;
    const hh = el.current ? el.current.offsetHeight / 2 : 80;
    const pad = 10;
    return {
      x: Math.max(-(r.width /2 - hw - pad), Math.min(r.width /2 - hw - pad, x)),
      y: Math.max(-(r.height/2 - hh - pad), Math.min(r.height/2 - hh - pad, y)),
    };
  };

  // Writes transform + shadow directly — no React re-render
  const paint = (isDrag: boolean, isHover: boolean) => {
    if (!el.current || !pos.current) return;
    const { x, y } = pos.current;
    const scale = isDrag ? 1.06 : isHover ? 1.025 : 1;
    const g = theme.glow;
    const shadow = isDrag
      ? `0 0 28px 6px rgba(${g},0.32), 0 12px 32px rgba(0,0,0,0.55)`
      : isHover
      ? `0 0 16px 3px rgba(${g},0.18), 0 8px 22px rgba(0,0,0,0.45)`
      : `0 4px 18px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)`;
    el.current.style.transform =
      `translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) rotate(${card.rotate}deg) scale(${scale})`;
    el.current.style.boxShadow = shadow;
  };

  // Momentum glide
  const glide = () => {
    if (!pos.current) return;
    vel.current.x *= 0.78;
    vel.current.y *= 0.78;
    const next = clamp(pos.current.x + vel.current.x, pos.current.y + vel.current.y);
    if (next.x !== pos.current.x + vel.current.x) vel.current.x = 0;
    if (next.y !== pos.current.y + vel.current.y) vel.current.y = 0;
    pos.current = next;
    paint(false, false);
    if (Math.abs(vel.current.x) > 0.08 || Math.abs(vel.current.y) > 0.08) {
      rafId.current = requestAnimationFrame(glide);
    }
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  useEffect(() => {
    pos.current = getInitial();
    // Kick off CSS transition for first paint
    if (el.current) {
      el.current.style.transition = "box-shadow 0.3s ease, transform 0.3s ease";
    }
    paint(false, false);

    const ro = new ResizeObserver(() => {
      if (pos.current) {
        pos.current = clamp(pos.current.x, pos.current.y);
        paint(false, false);
      }
    });
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => { ro.disconnect(); if(rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  useEffect(() => {
    if (el.current) el.current.style.zIndex = zIndex.toString();
  }, [zIndex]);

  // ── Pointer (unified mouse + touch, zero passive violations) ───────────────
  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    // e.preventDefault(); // React synthetic event doesn't always support this well with passive listeners, but let's try
    if (!pos.current) pos.current = getInitial();
    
    let cx, cy;
    if ('touches' in e) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
    } else {
        cx = (e as React.MouseEvent).clientX;
        cy = (e as React.MouseEvent).clientY;
    }

    drag.current = true;
    onFront(card.id);
    if(rafId.current) cancelAnimationFrame(rafId.current);
    origin.current = { mx:cx, my:cy, cx:pos.current.x, cy:pos.current.y };
    lastPt.current = { x:cx, y:cy, t:performance.now() };

    if (el.current) el.current.style.transition = "box-shadow 0.15s ease";
    paint(true, false);

    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (ev.cancelable) ev.preventDefault();
      let px, py;
      if ('touches' in ev) {
        px = ev.touches[0].clientX;
        py = ev.touches[0].clientY;
      } else {
        px = (ev as MouseEvent).clientX;
        py = (ev as MouseEvent).clientY;
      }

      const now = performance.now();
      const dt  = Math.max(1, now - lastPt.current.t);
      vel.current.x = (px - lastPt.current.x) / dt * 9;
      vel.current.y = (py - lastPt.current.y) / dt * 9;
      lastPt.current = { x:px, y:py, t:now };
      pos.current = clamp(origin.current.cx + px - origin.current.mx,
                          origin.current.cy + py - origin.current.my);
      if (el.current && pos.current) {
        el.current.style.transform =
          `translate(calc(-50% + ${pos.current.x}px),calc(-50% + ${pos.current.y}px)) rotate(${card.rotate}deg) scale(1.06)`;
      }
    };

    const onUp = () => {
      drag.current = false;
      if (el.current) el.current.style.transition = "box-shadow 0.3s ease, transform 0.25s ease";
      paint(false, false);
      rafId.current = requestAnimationFrame(glide);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };

    window.addEventListener("mousemove", onMove, { passive:false });
    window.addEventListener("mouseup",   onUp,   { passive:true  });
    window.addEventListener("touchmove", onMove, { passive:false });
    window.addEventListener("touchend",  onUp,   { passive:true  });
  };

  return (
    <div
      ref={el}
      onMouseDown={onDown}
      onTouchStart={onDown}
      onMouseEnter={() => { if (!drag.current) paint(false, true);  }}
      onMouseLeave={() => { if (!drag.current) paint(false, false); }}
      style={{
        position:"absolute",
        top:"50%", left:"50%",
        width:"clamp(175px,21vw,228px)",
        borderRadius:14,
        padding:"15px 15px 13px",
        cursor:"grab",
        userSelect:"none",
        WebkitUserSelect:"none",
        touchAction:"none",
        willChange:"transform",
        zIndex,
        background: theme.bg,
        overflow:"hidden",
        // Backdrop for glass depth on dark bg
        backdropFilter:"blur(0px)",
      }}
    >
      {/* Subtle inner border for depth */}
      <div style={{
        position:"absolute", inset:0, borderRadius:14, pointerEvents:"none",
        boxShadow:"inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2)",
      }}/>

      <div style={{ position:"relative" }}>
        <Stars rating={card.rating} light={isLight} />

        <p style={{
          margin:"0 0 11px",
          fontSize:"clamp(11px,1.35vw,13px)",
          lineHeight:1.55,
          color:card.textColor,
          fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
          fontWeight:400,
        }}>
          "{card.text}"
        </p>

        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Avatar name={card.name} idx={idx} />
          <div>
            <div style={{
              fontSize:"clamp(11px,1.3vw,13px)", fontWeight:600,
              color:card.textColor,
              fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
              lineHeight:1.3,
            }}>
              {card.name}
            </div>
            <div style={{
              fontSize:"clamp(8px,0.85vw,9px)", letterSpacing:"0.10em",
              color:isLight?"rgba(0,0,0,0.35)":"rgba(255,255,255,0.42)",
              fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
              marginTop:2, textTransform:"uppercase",
            }}>
              VERIFIED CUSTOMER
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ScatterTestimonial() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const maxZ      = useRef(CARDS.length);
  const [zMap, setZMap] = useState<Record<number, number>>(() =>
    Object.fromEntries(CARDS.map((c,i) => [c.id, i+1]))
  );

  const onFront = useCallback((id: number) => {
    maxZ.current += 1;
    setZMap(prev => ({ ...prev, [id]: maxZ.current }));
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{
        position:"relative",
        width:"100%", height:"100vh",
        background:"#030712",
        overflow:"hidden",
      }}
    >
      {/* Animated aurora + star-field background */}
      <BackgroundCanvas containerRef={canvasRef} />

      {/* Cards sit above canvas (zIndex ≥ 1) */}
      {CARDS.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          idx={i}
          zIndex={zMap[card.id]}
          onFront={onFront}
          canvasRef={canvasRef}
        />
      ))}
    </div>
  );
}
