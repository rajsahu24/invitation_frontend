'use client';

import { useEffect, useRef, useState } from 'react';

export default function SocialProofBar() {
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
      ref={sectionRef}
      className={`py-10 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="container-landing text-center">
        {/* Heading */}
        <h2
          className="mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 4vw, 28px)',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
          }}
        >
          Loved by Thousands of Families
        </h2>

        {/* Star row */}
        <div className="flex justify-center items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#F5C518"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          ))}
        </div>

        {/* Count text */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 400,
            color: 'var(--color-text-muted)',
          }}
        >
          4,823 families shared and printed their moments
        </p>

        {/* Vertical separator dots (hidden on mobile) */}
        <div className="hidden md:flex justify-center items-center gap-8 mt-6">
          <span
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: 'var(--color-border)' }}
          />
          <span
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: 'var(--color-border)' }}
          />
          <span
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: 'var(--color-border)' }}
          />
        </div>
      </div>
    </section>
  );
}
