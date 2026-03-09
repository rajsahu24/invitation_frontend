'use client';

import { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    quote:
      "Our wedding invitations were absolutely stunning! The countdown timer was such a hit with our guests, and everyone loved being able to RSVP so easily.",
    name: 'Emily & Michael',
    eventType: 'Wedding',
    initials: 'EM',
    color: '#D4E8D1',
  },
  {
    quote:
      "I've sent invitations for three baby showers now, and every time guests comment on how beautiful and easy to use they are. Highly recommend!",
    name: 'Sarah Johnson',
    eventType: 'Baby Shower',
    initials: 'SJ',
    color: '#FAE8E0',
  },
  {
    quote:
      "The ability to share on WhatsApp and Instagram Stories made inviting friends so much easier than dealing with paper invites. Plus, the designs are gorgeous!",
    name: 'David & Lisa',
    eventType: 'Anniversary',
    initials: 'DL',
    color: '#FFF3D6',
  },
];

export default function Testimonials() {
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
      className={`py-[100px] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="container-landing">
        {/* Header */}
        <h2
          className="text-center mb-12"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5vw, 36px)',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
          }}
        >
          What Families Are Saying
        </h2>

        {/* 3-Column Testimonial Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ gap: '24px' }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-[16px] p-7"
              style={{
                backgroundColor: 'var(--color-card-bg)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* 5 gold star icons */}
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#F5C518"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>

              {/* Quote text */}
              <p
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--color-text-body)',
                  lineHeight: 1.7,
                }}
              >
                "{testimonial.quote}"
              </p>

              {/* Divider line */}
              <div
                className="mb-4"
                style={{
                  height: '1px',
                  backgroundColor: 'var(--color-border)',
                }}
              />

              {/* Avatar row */}
              <div className="flex items-center gap-2.5">
                {/* Circle avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    backgroundColor: testimonial.color,
                    color: 'var(--color-text-heading)',
                  }}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <span
                    className="block text-sm font-semibold"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-heading)',
                    }}
                  >
                    {testimonial.name}
                  </span>
                  <span
                    className="block text-xs font-normal"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {testimonial.eventType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
