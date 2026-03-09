import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import HOTEL_IMG from "../assets/images/ui-designs/homepage_hero.png";

type NavItem =
  | { label: string; href: string; type: "anchor" }
  | { label: string; to: string; type: "route" };

const navItems: NavItem[] = [
  { label: "Home", href: "#home", type: "anchor" },
  { label: "Rooms", href: "#rooms", type: "anchor" },
  { label: "Case Studies", href: "#case-studies", type: "anchor" },
  { label: "Process", href: "#process", type: "anchor" },
  { label: "About", to: "/about", type: "route" },
  { label: "Contact", to: "/contact", type: "route" },
];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function FatahHotelHero() {
  const reduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 14);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const reveal = (delay = 0) =>
    reduceMotion
      ? {
          initial: { opacity: 1, y: 0, scale: 1 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 20, scale: 0.995 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.45, ease: EASE_OUT, delay },
        };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background:
          "radial-gradient(120% 95% at 50% 80%, rgba(201,168,76,0.14), transparent 62%), #0d0b08",
      }}
    >
      <style>{`
        .hero-header {
          position: fixed;
          top: 12px;
          left: 16px;
          right: 16px;
          width: auto;
          z-index: 40;
          border: 1px solid rgba(201,168,76,0.16);
          border-radius: 14px;
          transition: padding 220ms ease, background 220ms ease, box-shadow 220ms ease, backdrop-filter 220ms ease;
          backdrop-filter: blur(6px);
          background: rgba(13,11,8,0.58);
          padding: 14px 16px;
        }
        .hero-header.scrolled {
          padding: 10px 14px;
          backdrop-filter: blur(10px);
          background: rgba(13,11,8,0.78);
          box-shadow: 0 10px 26px rgba(0,0,0,0.34);
        }
        .hero-name {
          text-decoration: none;
          color: #f5ead8;
          font-family: Cinzel, serif;
          letter-spacing: 0.12em;
          font-size: 1.06rem;
          font-weight: 700;
          line-height: 1;
          display: inline-block;
        }
        .hero-nav-link {
          position: relative;
          text-decoration: none;
          color: rgba(245,234,216,0.88);
          font-family: Jost, sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 200ms ease, transform 200ms ease;
          transform: translateZ(0);
          will-change: transform;
        }
        .hero-nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -5px;
          height: 1px;
          background: #c9a84c;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 220ms ease;
        }
        .hero-nav-link:hover {
          color: #f5ead8;
          transform: scale(1.03);
        }
        .hero-nav-link:hover::after {
          transform: scaleX(1);
        }
        @media (max-width: 880px) {
          .hero-header {
            left: 10px;
            right: 10px;
            padding: 10px 12px;
          }
          .hero-name {
            font-size: 0.98rem;
          }
        }
      `}</style>

      <header className={`hero-header${isScrolled ? " scrolled" : ""}`}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <a href="#home" className="hero-name">
            Alyan <span style={{ color: "#c9a84c" }}>Haider</span>
          </a>

          <nav
            style={{
              marginTop: 10,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {navItems.map((item) =>
              item.type === "anchor" ? (
                <a key={item.label} href={item.href} className="hero-nav-link">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.to} className="hero-nav-link">
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </header>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          margin: "0 auto",
          width: "min(1240px, 96vw)",
          maxHeight: "90vh",
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.08 }}
          style={{ willChange: "transform, opacity", transformOrigin: "bottom center" }}
        >
          <img
            src={HOTEL_IMG}
            alt="Website hero"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
              objectPosition: "center bottom",
              filter: "saturate(1.15) brightness(1.16) contrast(1.05)",
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
          />
        </motion.div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(13,11,8,0.34) 4%, rgba(13,11,8,0.52) 58%, rgba(13,11,8,0.74) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 980,
          margin: "0 auto",
          minHeight: "100vh",
          padding: "130px 20px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <motion.p
          {...reveal(0.04)}
          style={{
            fontFamily: "Jost, sans-serif",
            color: "#c9a84c",
            letterSpacing: "0.2em",
            fontSize: "0.78rem",
            textTransform: "uppercase",
            willChange: "transform, opacity",
          }}
        >
          Full Stack Developer
        </motion.p>

        <motion.h1
          {...reveal(0.12)}
          style={{
            marginTop: 14,
            color: "#fff",
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(2rem, 7vw, 5rem)",
            lineHeight: 1.08,
            fontWeight: 600,
            willChange: "transform, opacity",
          }}
        >
          I Build Websites Based On
          <span style={{ color: "#e8c97a", fontStyle: "italic", marginLeft: 8 }}>
            Client Requests
          </span>
        </motion.h1>

        <motion.p
          {...reveal(0.24)}
          style={{
            marginTop: 18,
            color: "rgba(255,255,255,0.92)",
            fontFamily: "Jost, sans-serif",
            fontSize: "clamp(1rem, 2.2vw, 1.18rem)",
            lineHeight: 1.75,
            maxWidth: 780,
            marginLeft: "auto",
            marginRight: "auto",
            willChange: "transform, opacity",
          }}
        >
          Any business type, any niche, any custom requirement. I design, develop, improve UI, and optimize websites for smooth user experience and better business outcomes.
        </motion.p>

        <motion.p
          {...reveal(0.3)}
          style={{
            marginTop: 10,
            color: "rgba(232,201,122,0.9)",
            fontFamily: "Jost, sans-serif",
            fontSize: "0.78rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Note: This is a concept hotel website.
        </motion.p>

        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.36 }}
          style={{
            marginTop: 30,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            willChange: "transform, opacity",
          }}
        >
          <Link
            to="/contact"
            style={{
              textDecoration: "none",
              background: "#c9a84c",
              color: "#0d0b08",
              fontFamily: "Jost, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              padding: "12px 20px",
              borderRadius: 6,
            }}
          >
            Start Your Project
          </Link>
          <Link
            to="/about"
            style={{
              textDecoration: "none",
              border: "1px solid rgba(201,168,76,0.7)",
              color: "#e8c97a",
              fontFamily: "Jost, sans-serif",
              fontWeight: 600,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              padding: "12px 20px",
              borderRadius: 6,
            }}
          >
            About Me
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
