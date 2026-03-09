import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface CardItem {
  id: string | number;
  image: string;
  title: string;
  description: string;
  tag?: string;
  price?: string;
}

interface CardCarouselProps {
  items: CardItem[];
  sectionTitle?: string;
}

export default function CardCarousel({ items, sectionTitle }: CardCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of view width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      // Check scroll after animation
      setTimeout(checkScroll, 500);
    }
  };

  return (
    <div className="relative w-full py-10">
      {/* Header & Controls */}
      <div className="flex justify-between items-end mb-8 px-4 md:px-0 max-w-7xl mx-auto">
        <div>
          {sectionTitle && (
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#FAF7F2] mb-2">
              {sectionTitle}
            </h2>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-3 rounded-full border border-[#C9A96E]/30 transition-all duration-300 ${
              canScrollLeft 
                ? 'bg-[#0D0B08] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0D0B08] cursor-pointer' 
                : 'bg-transparent text-[#C9A96E]/20 cursor-not-allowed border-[#C9A96E]/10'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-3 rounded-full border border-[#C9A96E]/30 transition-all duration-300 ${
              canScrollRight 
                ? 'bg-[#0D0B08] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0D0B08] cursor-pointer' 
                : 'bg-transparent text-[#C9A96E]/20 cursor-not-allowed border-[#C9A96E]/10'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto gap-6 pb-12 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory max-w-7xl mx-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex-none w-[280px] md:w-[350px] snap-start"
          >
            <div className="relative h-[420px] rounded-2xl overflow-hidden bg-[#131109] border border-[#C9A96E]/20 transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_-10px_rgba(201,169,110,0.15)] group-hover:border-[#C9A96E]/50">
              
              {/* Image */}
              <div className="h-1/2 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#131109] to-transparent z-10 opacity-60" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Tag/Price Badge */}
                {(item.tag || item.price) && (
                  <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                    {item.price && (
                      <span className="px-3 py-1 bg-[#0D0B08]/80 backdrop-blur-md border border-[#C9A96E]/30 text-[#C9A96E] text-sm font-medium rounded-full">
                        {item.price}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 h-1/2 flex flex-col relative z-20">
                {item.tag && (
                  <span className="text-[#C9A96E] text-xs font-bold tracking-widest uppercase mb-2">
                    {item.tag}
                  </span>
                )}
                
                <h3 className="text-2xl font-serif font-bold text-[#FAF7F2] mb-3 group-hover:text-[#C9A96E] transition-colors duration-300">
                  {item.title}
                </h3>
                
                <p className="text-[#FAF7F2]/60 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {item.description}
                </p>

                <button className="flex items-center gap-2 text-[#C9A96E] text-sm font-bold tracking-wider uppercase group/btn">
                  <span>Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#C9A96E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
