'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  template_name: string;
  template_type: string;
  template_image?: string;
  template_url?: string;
  is_active: boolean;
}

export default function TemplateSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const router = useRouter();

  // Calculate card width based on container
  const cardWidth = useCallback(() => {
    if (typeof window === 'undefined') return 280;
    if (window.innerWidth < 640) return window.innerWidth * 0.85; // 85% of viewport on mobile
    if (window.innerWidth < 1024) return 240;
    return 280;
  }, []);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          const activeTemplates = data.filter((template: Template) => 
            template.is_active === true || template.is_active === undefined
          );
          setTemplates(activeTemplates);
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-scroll functionality with proper infinite scrolling
  const scrollToIndex = useCallback((index: number) => {
    if (!sliderRef.current || templates.length === 0) return;
    
    const cardW = cardWidth();
    const gap = 20; // gap-5 = 20px
    const scrollPosition = (cardW + gap) * index;
    
    sliderRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
    setCurrentIndex(index);
  }, [templates.length, cardWidth]);

  const goToNext = useCallback(() => {
    if (templates.length === 0) return;
    const nextIndex = (currentIndex + 1) % templates.length;
    scrollToIndex(nextIndex);
  }, [currentIndex, templates.length, scrollToIndex]);

  const goToPrev = useCallback(() => {
    if (templates.length === 0) return;
    const prevIndex = currentIndex === 0 ? templates.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  }, [currentIndex, templates.length, scrollToIndex]);

  // Auto-scroll with pause on hover
  useEffect(() => {
    if (templates.length === 0) return;
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      if (!isPaused && !isDragging && !isHovered) {
        goToNext();
      }
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [templates.length, isPaused, isDragging, isHovered, goToNext]);

  // Handle scroll position to track current index
  const handleScroll = useCallback(() => {
    if (!sliderRef.current || templates.length === 0) return;
    
    const cardW = cardWidth();
    const gap = 20;
    const currentScroll = sliderRef.current.scrollLeft;
    const newIndex = Math.round(currentScroll / (cardW + gap)) % templates.length;
    
    if (newIndex >= 0 && newIndex < templates.length) {
      setCurrentIndex(newIndex);
    }
  }, [templates.length, cardWidth]);

  // Mouse drag handlers for manual sliding
  const onMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll-fast
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleTemplateClick = (template: Template) => {
    router.push(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/preview/${template.template_type?.replace(/ /g, "_")}/${template.template_name?.replace(/ /g, "_")}/demo`);
  };

  // Handle mouse enter/leave for pause
  const handleMouseEnter = () => {
    setIsPaused(true);
    setIsHovered(true);
  };

  const handleMouseExit = () => {
    setIsPaused(false);
    setIsHovered(false);
  };

  // Loading state
  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="py-12"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div className="container-landing">
          <div className="flex justify-center items-center h-[280px]">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-[var(--color-border)] rounded-full" />
              <div className="absolute inset-0 border-4 border-t-[var(--color-accent-primary)] rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Duplicate templates for infinite scroll effect
  const duplicatedTemplates = [...templates, ...templates, ...templates];

  return (
    <section
      ref={sectionRef}
      className={`py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Section Header */}
      <div className="container-landing mb-8">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              backgroundColor: 'rgba(74, 124, 89, 0.1)',
              color: 'var(--color-accent-primary)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Premium Collection
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-heading)',
            }}
          >
            Choose Your{' '}
            <span style={{ color: 'var(--color-accent-primary)' }}>Perfect Style</span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-body)',
            }}
          >
            Handcrafted designs that move with your celebration. Find the one that speaks to your event.
          </p>
        </div>
      </div>

      {/* Slider Container */}
      <div 
        ref={containerRef}
        className="relative group px-4 md:px-8"
      >

        {/* Left Arrow */}
        <button
          onClick={goToPrev}
          className="hidden  absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full lg:flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[var(--color-accent-primary)] hover:text-white bg-white/90 md:bg-white shadow-lg md:shadow-[var(--shadow-card)] opacity-100 md:opacity-0 md:group-hover:opacity-100"
          style={{
            color: 'var(--color-accent-primary)',
          }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="hidden absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full lg:flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[var(--color-accent-primary)] hover:text-white bg-white/90 md:bg-white shadow-lg md:shadow-[var(--shadow-card)] opacity-100 md:opacity-0 md:group-hover:opacity-100"
          style={{
            color: 'var(--color-accent-primary)',
          }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Cards Container - with drag and touch support */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar px-2 md:px-4 snap-x snap-mandatory py-4 cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseExit}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {templates.map((template, idx) => (
            <div
              key={`${template.id}-${idx}`}
              className="flex-shrink-0 snap-center w-[85vw] sm:w-[240px] md:w-[260px] lg:w-[280px]"
            >
            <Link target='_blank' href={`/preview/${template.template_type?.replace(/ /g, "_")}/${template.template_name?.replace(/ /g, "_")}/demo`}>
              <div
                className="group/card cursor-pointer transition-all duration-300 hover:-translate-y-2"
              >
                {/* Full Scrollable Template Preview */}
                <div className="relative">
                  {/* Template Container with scroll */}
                  <div
                    className="relative rounded-2xl overflow-hidden transition-all duration-300 group-hover/card:shadow-xl border border-[var(--color-border)] shadow-[var(--shadow-card)] h-[75vh]"
                  >
                    {template.template_url ? (
                      <iframe
                        src={template.template_url}
                        className="w-full h-full"
                        title={template.template_name}
                      />
                    ) : template.template_image ? (
                      <div className="w-full h-full overflow-y-auto no-scrollbar">
                        <img
                          src={template.template_image}
                          alt={template.template_name}
                          className="w-full h-auto object-cover"
                        />
                        {/* Gradient overlay at bottom for scroll indication */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #D4E8D1 0%, #E8F5E9 100%)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '48px',
                            color: 'var(--color-accent-primary)',
                          }}
                        >
                          ✦
                        </span>
                      </div>
                    )}

                    {/* Scroll indicator - only show when using image */}
                    {template.template_image && !template.template_url && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
                        <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="mt-4 text-center">
                    <h3
                      className="text-base font-bold mb-1 truncate px-2"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-heading)',
                      }}
                    >
                      {template.template_name}
                    </h3>
                    <p
                      className="text-xs uppercase tracking-wider mb-2"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {template.template_type}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-accent-primary)',
                      }}
                    >
                      View Template
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-2 mt-6 md:mt-8 px-4">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className="rounded-full transition-all duration-300 hover:scale-110"
              style={{
                width: currentIndex === index ? '24px' : '8px',
                height: '8px',
                backgroundColor:
                  currentIndex === index
                    ? 'var(--color-accent-primary)'
                    : 'var(--color-border)',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
