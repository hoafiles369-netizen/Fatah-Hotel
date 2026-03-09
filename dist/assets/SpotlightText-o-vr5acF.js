import{r as p,j as a}from"./index-BE-X-a4T.js";function d(){const s=p.useRef(null);p.useEffect(()=>{const e=s.current;if(!e)return;const n=(i,t)=>{e.style.setProperty("--x",`${i}px`),e.style.setProperty("--y",`${t}px`)},o=i=>{const t=e.getBoundingClientRect();n(i.clientX-t.left,i.clientY-t.top)},l=i=>{const t=e.getBoundingClientRect(),c=i.touches[0];n(c.clientX-t.left,c.clientY-t.top)};return e.addEventListener("mousemove",o),e.addEventListener("touchmove",l,{passive:!0}),()=>{e.removeEventListener("mousemove",o),e.removeEventListener("touchmove",l)}},[]);const r=`This project is a concept hotel website created to demonstrate how modern design and smooth interactions can improve the way hospitality businesses present their rooms online. The focus was to build a clean and visually appealing interface where visitors can easily explore available rooms while enjoying subtle animations and interactive elements that make the experience feel more engaging.

Each room is displayed through interactive cards with smooth image transitions and hover effects, allowing users to preview the space in a simple and intuitive way. The goal of this project was not only to design a beautiful interface, but also to show how thoughtful user experience and polished front-end development can help hotels present their services more professionally and create a positive first impression for potential guests.`;return a.jsxs("section",{id:"about",children:[a.jsx("style",{children:`
        .spotlight-page {
          width: 100%;
          min-height: 80vh;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          position: relative;
          z-index: 10;
        }

        .spotlight-wrap {
          position: relative;
          width: 100%;
          max-width: 900px;
          --x: 50%;
          --y: 50%;
        }

        /* Base text — blurry and barely visible by default */
        .text-base {
          font-family: 'Jost', sans-serif;
          font-size: clamp(1.1rem, 2vw, 1.8rem);
          font-weight: 400;
          line-height: 1.6;
          letter-spacing: 0.02em;
          text-align: justify;
          color: rgba(255, 255, 255, 0.15);
          filter: blur(3px);
          display: block;
          user-select: none;
          pointer-events: none;
          transition: opacity 0.5s ease, filter 0.5s ease;
        }

        .spotlight-wrap:hover .text-base {
          opacity: 0.3;
          filter: blur(0px);
        }

        /* Reveal text — masked by cursor position */
        .text-reveal-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.3s ease;
          mask-image: radial-gradient(circle 180px at var(--x) var(--y), black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle 180px at var(--x) var(--y), black 0%, transparent 100%);
        }

        .spotlight-wrap:hover .text-reveal-wrap,
        .spotlight-wrap:active .text-reveal-wrap {
          opacity: 1;
        }

        .text-reveal {
          font-family: 'Jost', sans-serif;
          font-size: clamp(1.1rem, 2vw, 1.8rem);
          font-weight: 400;
          line-height: 1.6;
          letter-spacing: 0.02em;
          text-align: justify;
          color: #C9A96E; /* Gold color for reveal */
          display: block;
          user-select: none;
        }

        @media (max-width: 768px) {
          .spotlight-page {
            padding: 3rem 1.5rem;
            min-height: auto;
          }
          .text-base {
            text-align: left;
            filter: blur(0px);
            opacity: 0.3;
          }
          .text-reveal {
            text-align: left;
          }
          /* On mobile, make the reveal easier to see */
          .text-reveal-wrap {
            mask-image: radial-gradient(circle 120px at var(--x) var(--y), black 0%, transparent 100%);
            -webkit-mask-image: radial-gradient(circle 120px at var(--x) var(--y), black 0%, transparent 100%);
          }
        }
      `}),a.jsx("div",{className:"spotlight-page",children:a.jsxs("div",{ref:s,className:"spotlight-wrap",children:[a.jsx("span",{className:"text-base",children:r}),a.jsx("div",{className:"text-reveal-wrap",children:a.jsx("span",{className:"text-reveal",children:r})})]})})]})}export{d as default};
