'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ExternalLink } from 'lucide-react';

interface Template {
  id: string;
  template_name: string;
  template_type: string;
  template_image?: string;
}

export default function TemplateSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const minSwipeDistance = 50;

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          setTemplates(data);
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

  // Auto-scroll functionality
  const goToNext = useCallback(() => {
    if (templates.length === 0) return;
    const newIndex = (currentIndex + 1) % templates.length;
    setCurrentIndex(newIndex);
    
    if (sliderRef.current) {
      const scrollWidth = sliderRef.current.scrollWidth / templates.length;
      sliderRef.current.scrollTo({
        left: scrollWidth * newIndex,
        behavior: 'smooth',
      });
    }
  }, [currentIndex, templates.length]);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused && !isDragging && templates.length > 0) {
        goToNext();
      }
    }, 3500);
  }, [isPaused, isDragging, templates.length, goToNext]);

  useEffect(() => {
    if (templates.length > 0) {
      startAutoScroll();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [templates.length, startAutoScroll]);

  const handlePrev = () => {
    if (!sliderRef.current || templates.length === 0) return;
    const scrollWidth = sliderRef.current.scrollWidth / templates.length;
    const newIndex = currentIndex === 0 ? templates.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    sliderRef.current.scrollTo({
      left: scrollWidth * newIndex,
      behavior: 'smooth',
    });
  };

  const handleNext = () => {
    goToNext();
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    setIsDragging(false);
  };

  // Mouse drag handlers for manual sliding
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const handleTemplateClick = (template: Template) => {
    router.push(`/templates/${template.template_name?.replace(/ /g, '_')}`);
  };

  // Scroll handler to update current index based on scroll position
  const handleScroll = () => {
    if (!sliderRef.current || templates.length === 0) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const scrollWidth = sliderRef.current.scrollWidth / templates.length;
    const newIndex = Math.round(scrollLeft / scrollWidth) % templates.length;
    setCurrentIndex(newIndex);
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
      <div className="relative group">
        {/* Gradient overlays for fade effect */}
          {/* <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" /> */}

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[var(--color-accent-primary)] hover:text-white opacity-0 group-hover:opacity-100"
          style={{
            backgroundColor: 'white',
            boxShadow: 'var(--shadow-card)',
            color: 'var(--color-accent-primary)',
          }}
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[var(--color-accent-primary)] hover:text-white opacity-0 group-hover:opacity-100"
          style={{
            backgroundColor: 'white',
            boxShadow: 'var(--shadow-card)',
            color: 'var(--color-accent-primary)',
          }}
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>

        {/* Cards Container - with drag and touch support */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto no-scrollbar px-6 md:px-20 snap-x snap-mandatory py-4 cursor-grab active:cursor-grabbing"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onScroll={handleScroll}
        >
          {duplicatedTemplates.map((template, idx) => (
            <div
              key={`${template.id}-${idx}`}
              className="flex-shrink-0 snap-center"
              style={{ width: 'clamp(180px, 28vw, 280px)' }}
            >
              <div
                className="group/card cursor-pointer transition-all duration-300 hover:-translate-y-2"
                onClick={() => {
                  if (idx < templates.length || idx >= templates.length * 2) {
                    handleTemplateClick(template);
                  }
                }}
              >
                {/* Phone Mockup */}
                <div className="relative">
                  {/* Outer Frame */}
                  <div
                    className="relative rounded-[32px] overflow-hidden transition-all duration-300 group-hover/card:shadow-xl"
                    style={{
                      backgroundColor: '#1a1a1a',
                      padding: '8px',
                      boxShadow: 'var(--shadow-phone)',
                    }}
                  >
                    {/* Notch */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-28 bg-[#1a1a1a] rounded-b-xl z-10"
                    />

                    {/* Screen */}
                    <div
                      className="relative rounded-[26px] overflow-hidden aspect-[9/16]"
                      style={{ backgroundColor: 'white' }}
                    >
                      {template.template_image ? (
                        <img
                          src={template.template_image}
                          alt={template.template_name}
                          className="w-full h-full object-cover"
                        />
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

                      {/* Gradient overlay at bottom */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"
                      />
                    </div>
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
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {templates.slice(0, Math.min(templates.length, 6)).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!sliderRef.current || templates.length === 0) return;
                const scrollWidth = sliderRef.current.scrollWidth / templates.length;
                setCurrentIndex(index);
                sliderRef.current.scrollTo({
                  left: scrollWidth * index,
                  behavior: 'smooth',
                });
              }}
              className="rounded-full transition-all duration-300"
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
