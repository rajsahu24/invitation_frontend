'use client';

import { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    title: 'Beautiful Templates',
    description:
      'Choose from 100+ professionally designed invitation styles for every occasion.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    title: 'Live Countdown Timers',
    description:
      'Real-time countdown your guests can view, screenshot, and share anywhere.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Share Anywhere',
    description:
      'Send via WhatsApp, Instagram Stories, email, or print full-resolution at home.',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      id="features"
      ref={sectionRef}
      className={`py-[100px] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: 'var(--color-bg-section-alt)' }}
    >
      <div className="container-landing">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Small label */}
          <span
            className="inline-block uppercase tracking-[0.12em] mb-4 text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-accent-primary)',
            }}
          >
            ✦ WHY CHOOSE US
          </span>

          {/* H2 */}
          <h2
            className="mx-auto"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              maxWidth: '500px',
            }}
          >
            Everything You Need to Create Magic
          </h2>
        </div>

        {/* 3-Column Feature Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ gap: '24px' }}
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="rounded-[16px] p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--color-card-bg)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Icon container */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: 'rgba(74, 124, 89, 0.1)',
                  color: 'var(--color-accent-primary)',
                }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'var(--color-text-body)',
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
