'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.filter((t: Template) => t.is_active !== false));
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Track current index from native scroll position
  const handleScroll = useCallback(() => {
    if (!sliderRef.current || templates.length === 0) return;
    const el = sliderRef.current;
    const cardW = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 0;
    if (cardW === 0) return;
    const index = Math.round(el.scrollLeft / cardW);
    setCurrentIndex(Math.min(index, templates.length - 1));
  }, [templates.length]);

  const scrollToIndex = useCallback((index: number) => {
    if (!sliderRef.current || templates.length === 0) return;
    const el = sliderRef.current;
    const cardW = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 0;
    el.scrollTo({ left: cardW * index, behavior: 'smooth' });
    setCurrentIndex(index);
  }, [templates.length]);

  const goToNext = () => scrollToIndex((currentIndex + 1) % templates.length);
  const goToPrev = () => scrollToIndex(currentIndex === 0 ? templates.length - 1 : currentIndex - 1);

  if (loading) {
    return (
      <section ref={sectionRef} className="py-12" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="flex justify-center items-center h-[280px]">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-[var(--color-border)] rounded-full" />
            <div className="absolute inset-0 border-4 border-t-[var(--color-accent-primary)] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  const marqueeItems = [...templates, ...templates, ...templates];

  return (
    <section
      ref={sectionRef}
      className={`py-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Header */}
      <div className="container-landing mb-8 px-4">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ backgroundColor: 'rgba(74, 124, 89, 0.1)', color: 'var(--color-accent-primary)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Premium Collection
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}
          >
            Choose Your{' '}
            <span style={{ color: 'var(--color-accent-primary)' }}>Perfect Style</span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-body)' }}
          >
            Handcrafted designs that move with your celebration. Find the one that speaks to your event.
          </p>
        </div>
      </div>

      {/* ── DESKTOP: CSS marquee ── */}
      <div
        className="hidden md:block relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
          style={{ background: 'linear-gradient(to right, var(--color-bg-primary), transparent)' }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
          style={{ background: 'linear-gradient(to left, var(--color-bg-primary), transparent)' }}
        />
        <div
          className="flex gap-5 py-4"
          style={{
            width: 'max-content',
            animation: `marquee ${templates.length * 4}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {marqueeItems.map((template, idx) => (
            <TemplateCard key={`${template.id}-${idx}`} template={template} />
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 3)); }
          }
        `}</style>
      </div>

      {/* ── MOBILE: native snap scroll ── */}
      <div className="md:hidden">
        {/* Arrows + slider row */}
        <div className="flex items-center gap-2 px-4">
          <button
            onClick={goToPrev}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md border border-[var(--color-border)]"
            style={{ color: 'var(--color-accent-primary)' }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slider — native scroll, no custom touch handlers */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 flex-1"
            onScroll={handleScroll}
          >
            {templates.map((template, idx) => (
              <div key={`${template.id}-${idx}`} className="flex-shrink-0 snap-center w-[75vw]">
                <TemplateCard template={template} mobile />
              </div>
            ))}
          </div>

          <button
            onClick={goToNext}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md border border-[var(--color-border)]"
            style={{ color: 'var(--color-accent-primary)' }}
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className="rounded-full transition-all duration-300"
              style={{
                width: currentIndex === index ? '24px' : '8px',
                height: '8px',
                backgroundColor: currentIndex === index
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

function TemplateCard({ template, mobile = false }: { template: Template; mobile?: boolean }) {
  return (
    <Link
      href={`/preview/${template.template_type?.replace(/ /g, '_')}/${template.template_name?.replace(/ /g, '_')}/demo`}
      target="_blank"
      className={`block group/card transition-all duration-300 hover:-translate-y-2 ${mobile ? '' : 'w-[260px] lg:w-[280px]'}`}
    >
      <div
        className={`relative rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-card)] group-hover/card:shadow-xl transition-all duration-300 ${
          mobile ? 'h-[55vh]' : 'h-[75vh]'
        }`}
      >
        {template.template_url ? (
          <iframe
            src={template.template_url}
            className="w-full h-full pointer-events-none"
            title={template.template_name}
            tabIndex={-1}
          />
        ) : template.template_image ? (
          <div className="w-full h-full overflow-y-auto no-scrollbar">
            <img
              src={template.template_image}
              alt={template.template_name}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D4E8D1 0%, #E8F5E9 100%)' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--color-accent-primary)' }}>
              ✦
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 text-center">
        <h3
          className="text-sm font-bold mb-0.5 truncate px-2"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-heading)' }}
        >
          {template.template_name}
        </h3>
        <p
          className="text-xs uppercase tracking-wider mb-1.5"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
        >
          {template.template_type}
        </p>
        <span
          className="inline-flex items-center gap-1 text-xs font-medium"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent-primary)' }}
        >
          View Template <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
