import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

gsap.registerPlugin(Draggable);

interface CardItem {
  id: string | number;
  image: string;
  title: string;
  description: string;
  tag?: string;
  price?: string;
}

interface SeamlessCarouselProps {
  items: CardItem[];
}

export default function SeamlessCarousel({ items }: SeamlessCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const proxyRef = useRef<HTMLDivElement>(document.createElement("div")); // Proxy for Draggable
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Animation state
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const updateCards = useCallback(() => {
    if (!containerRef.current) return;
    
    const total = items.length;
    const progress = gsap.utils.wrap(0, 1, progressRef.current);
    const spacing = 1 / total;
    const containerWidth = containerRef.current.offsetWidth;
    
    // Visual configuration
    const xSpread = containerWidth * 0.6; // Width of the spread
    const scaleCenter = 1;
    const scaleEdge = 0.5;
    const opacityCenter = 1;
    const opacityEdge = 0.2;
    
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      
      // Calculate normalized position (0..1) for this card
      // We offset by 0.5 so the first item (i=0) starts at center if progress is 0?
      // Let's say i=0 is at 0.
      // If progress = 0, item 0 is at 0.
      // We want item 0 to be at 0.5 (center) when progress is 0?
      // Let's adjust: pos = (i * spacing + progress) % 1
      
      const rawPos = (i * spacing + progress) % 1;
      const pos = rawPos < 0 ? 1 + rawPos : rawPos; // Ensure positive 0..1
      
      // Distance from center (0.5)
      let dist = Math.abs(pos - 0.5);
      // Handle wrapping distance (e.g. 0.1 and 0.9 are close)
      // But in this linear 0..1 mapping, 0 and 1 are the same point (edges).
      // We want 0.5 to be center. 0 and 1 are far edges.
      
      // Calculate visual properties
      // Gaussian-ish or simple linear interpolation based on distance from 0.5
      const distFromCenter = dist * 2; // 0 at center, 1 at edges
      
      // Scale: 1 at center, 0.5 at edges
      const scale = scaleCenter - (distFromCenter * (scaleCenter - scaleEdge));
      
      // Opacity: 1 at center, 0.2 at edges
      const opacity = opacityCenter - (distFromCenter * (opacityCenter - opacityEdge));
      
      // Z-Index: Higher at center
      const zIndex = Math.round((1 - distFromCenter) * 100);
      
      // X Position: Map 0..1 to -Spread..+Spread
      // We want 0.5 -> 0
      // 0 -> -Spread
      // 1 -> +Spread
      const x = (pos - 0.5) * containerWidth * 1.2; // 1.2 spread factor
      
      // 3D Rotation (optional, adds depth)
      // 0.5 -> 0deg
      // 0 -> 45deg
      // 1 -> -45deg
      const rotateY = (0.5 - pos) * 60; 

      gsap.set(card, {
        x: x,
        scale: scale,
        opacity: opacity,
        zIndex: zIndex,
        rotateY: rotateY,
        transformOrigin: "center center",
        filter: `brightness(${1 - distFromCenter * 0.5}) blur(${distFromCenter * 5}px)`, // Blur edges
      });
      
      // Update active index
      if (dist < spacing / 2) {
        if (activeIndex !== i) setActiveIndex(i);
      }
    });
  }, [items.length, activeIndex]);

  // Animation Loop
  useEffect(() => {
    const loop = () => {
      // Smoothly interpolate current progress to target
      // This gives the "momentum" feel
      const diff = targetProgressRef.current - progressRef.current;
      
      if (Math.abs(diff) > 0.0001) {
        progressRef.current += diff * 0.1; // Easing factor
        updateCards();
        requestAnimationFrame(loop);
      } else {
        // Snap to nearest?
      }
    };
    // We'll use GSAP ticker or requestAnimationFrame
    // Actually, Draggable has its own momentum.
    // Let's use Draggable's update to set progress.
  }, [updateCards]);

  // Initialize Draggable
  useEffect(() => {
    if (!containerRef.current) return;
    
    const total = items.length;
    const wrap = gsap.utils.wrap(0, 1);
    
    // Initial update
    updateCards();

    // Create a proxy object to tween
    const proxy = { value: 0 };
    
    const draggable = Draggable.create(proxyRef.current, {
      trigger: containerRef.current,
      type: "x",
      inertia: true,
      onDrag: function() {
        // Map drag px to progress (0..1)
        // Dragging left (negative x) should decrease progress (move items left)
        const dragDelta = this.deltaX;
        const progressDelta = (dragDelta / containerRef.current!.offsetWidth);
        progressRef.current = wrap(progressRef.current + progressDelta);
        updateCards();
      },
      onThrowUpdate: function() {
        const dragDelta = this.deltaX;
        const progressDelta = (dragDelta / containerRef.current!.offsetWidth);
        progressRef.current = wrap(progressRef.current + progressDelta);
        updateCards();
      },
      onThrowComplete: function() {
        // Snap logic could go here
      }
    })[0];

    return () => {
      draggable.kill();
    };
  }, [items, updateCards]);

  const handleMove = (dir: 1 | -1) => {
    const total = items.length;
    const spacing = 1 / total;
    
    // Target next slot
    // Next (1) -> Move items Left -> Decrease progress
    // Prev (-1) -> Move items Right -> Increase progress
    const current = progressRef.current;
    const target = current + (dir * -1 * spacing);
    
    // Animate
    gsap.to(progressRef, {
      current: target,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        // Wrap for rendering
        progressRef.current = gsap.utils.wrap(0, 1, progressRef.current);
        updateCards();
      }
    });
  };

  return (
    <div className="relative w-full py-20 overflow-hidden bg-[#0D0B08]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#C9A96E]/5 blur-[100px] rounded-full" />
      </div>
      
      {/* Proxy element for Draggable */}
      <div ref={proxyRef} className="absolute top-0 left-0 w-full h-full z-20" style={{ display: 'none' }} />

      <div 
        ref={containerRef}
        className="relative h-[500px] w-full max-w-7xl mx-auto flex items-center justify-center perspective-1000 touch-pan-y"
        style={{ perspective: "1000px" }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="absolute top-1/2 left-1/2 w-[260px] md:w-[280px] h-[380px] -translate-x-1/2 -translate-y-1/2 bg-[#131109] rounded-2xl border border-[#C9A96E]/20 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing group will-change-transform"
          >
            {/* Image */}
            <div className="h-[55%] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#131109] to-transparent z-10 opacity-60" />
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                draggable={false}
              />
            </div>

            {/* Content */}
            <div className="p-5 h-[45%] flex flex-col relative z-20 bg-[#131109]">
              <h3 className="text-xl font-serif font-bold text-[#FAF7F2] mb-2 group-hover:text-[#C9A96E] transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[#FAF7F2]/60 text-xs leading-relaxed line-clamp-3 mb-3">
                {item.description}
              </p>
              <div className="mt-auto pt-2 flex items-center justify-between border-t border-[#C9A96E]/10">
                <span className="text-[#C9A96E] font-bold text-sm">{item.price}</span>
                <button className="text-[#FAF7F2]/80 text-[10px] uppercase tracking-widest hover:text-[#C9A96E] transition-colors flex items-center gap-1">
                  View <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            {/* Hover Glow */}
            <div className="absolute inset-0 border-2 border-[#C9A96E] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none shadow-[0_0_30px_rgba(201,169,110,0.3)]" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 z-30">
        <button 
          className="p-4 rounded-full bg-[#131109]/80 backdrop-blur-md border border-[#C9A96E]/30 text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0D0B08] transition-all hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
          onClick={() => handleMove(-1)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          className="p-4 rounded-full bg-[#131109]/80 backdrop-blur-md border border-[#C9A96E]/30 text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0D0B08] transition-all hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
          onClick={() => handleMove(1)}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
