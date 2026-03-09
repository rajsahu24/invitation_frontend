'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function CTA() {
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
      className={`py-20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: 'var(--color-accent-primary)' }}
    >
      <div className="container-landing text-center">
        {/* H2 */}
        <h2
          className="mx-auto mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5vw, 38px)',
            fontWeight: 700,
            color: 'var(--color-text-white)',
            lineHeight: 1.2,
            maxWidth: '560px',
          }}
        >
          Start Creating Your Perfect Invitation Today
        </h2>

        {/* Subtext */}
        <p
          className="mx-auto mb-8"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.75)',
            maxWidth: '400px',
          }}
        >
          Free to start. No credit card required.
        </p>

        {/* CTA Button */}
        <Link
          href="/login"
          className="inline-block px-9 py-4 text-sm font-semibold rounded-[50px] transition-all duration-200 hover:bg-[--color-bg-section-alt]"
          style={{
            backgroundColor: 'white',
            color: 'var(--color-accent-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Create Your Invite Free →
        </Link>
      </div>
    </section>
  );
}
