'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
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

  // Template preview URL - using a sample template
  const templatePreviewUrl = `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/preview/wedding/botanical_garden/demo`;

  return (
    <section
      ref={sectionRef}
      className={`pt-[100px] pb-[80px] md:pt-[120px] md:pb-[100px] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="container-landing">
        {/* 2-column CSS Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center"
          style={{ gap: '60px' }}
        >
          {/* LEFT COLUMN — Copy */}
<div className="order-1">
  {/* Label pill */}
  <div
    className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 mb-7 text-[11px] uppercase tracking-[0.14em]"
    style={{
      backgroundColor: 'rgba(74, 124, 89, 0.08)',
      color: 'var(--color-accent-primary)',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      border: '1px solid rgba(74, 124, 89, 0.2)',
    }}
  >
    <span style={{ fontSize: '8px' }}>✦</span>
    Trusted by 10,000+ Families Worldwide
  </div>

  {/* H1 Heading */}
  <h1
    className="mb-5 leading-[1.12]"
    style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(38px, 5vw, 56px)',
      fontWeight: 700,
      color: 'var(--color-text-heading)',
      letterSpacing: '-0.01em',
    }}
  >
    Create Beautiful{' '}
    <span
      style={{
        color: 'var(--color-accent-primary)',
        fontStyle: 'italic',
        fontWeight: 400,
      }}
    >
      Digital Invitation
    </span>{' '}
    in Minutes
  </h1>

  {/* Subheading */}
  <p
    className="mb-3 max-w-[460px]"
    style={{
      fontFamily: 'var(--font-body)',
      fontSize: '17px',
      fontWeight: 600,
      color: 'var(--color-text-heading)',
      lineHeight: 1.4,
    }}
  >
    The all-in-one platform for beautiful digital invitations & live countdowns.
  </p>

  {/* Body paragraph */}
  <p
    className="mb-9 max-w-[460px] leading-[1.75]"
    style={{
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      fontWeight: 400,
      color: 'var(--color-text-body)',
    }}
  >
    Create free digital invitations for weddings, birthdays & baby showers. 
Add live countdowns, personalize every detail, and share instantly. 
Start designing today.
  </p>

  {/* CTA Buttons */}
  <div className="flex flex-wrap items-center gap-3 mb-10">
    <Link
      href="/host"
      className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-[50px] transition-all duration-200"
      style={{
        backgroundColor: 'var(--color-accent-primary)',
        color: 'var(--color-text-white)',
        fontFamily: 'var(--font-body)',
        boxShadow: '0 4px 16px rgba(74, 124, 89, 0.35)',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#3a6347';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(74,124,89,0.45)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--color-accent-primary)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(74,124,89,0.35)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
      }}
    >
      Start for Free <ArrowRight className="w-4 h-4" />
    </Link>

    <Link
      href="/templates"
      className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium rounded-[50px] transition-all duration-200"
      style={{
        color: 'var(--color-accent-primary)',
        fontFamily: 'var(--font-body)',
        border: '1.5px solid rgba(74, 124, 89, 0.35)',
        backgroundColor: 'transparent',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(74,124,89,0.06)';
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-accent-primary)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(74,124,89,0.35)';
      }}
    >
      Browse Templates <ArrowRight className="w-4 h-4" />
    </Link>
  </div>

  {/* Trust bar */}
  <div
    className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-5"
    style={{
      borderTop: '1px solid var(--color-border)',
    }}
  >
    {/* Stars + rating */}
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="#F5C518">
            <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75L8 1z" />
          </svg>
        ))}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--color-text-heading)',
        }}
      >
        4.9
      </span>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 400,
          color: 'var(--color-text-muted)',
        }}
      >
        (2,400+ reviews)
      </span>
    </div>

    {/* Divider dot */}
    <span style={{ color: 'var(--color-border)', fontSize: '18px', lineHeight: 1 }}>·</span>

    {/* No credit card */}
    <div className="flex items-center gap-1.5">
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="#4A7C59" strokeWidth="1.8">
        <path d="M13 4L6.5 11 3 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--color-text-muted)',
        }}
      >
        No credit card required
      </span>
    </div>

    {/* Divider dot */}
    <span style={{ color: 'var(--color-border)', fontSize: '18px', lineHeight: 1 }}>·</span>

    {/* Free forever */}
    <div className="flex items-center gap-1.5">
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="#4A7C59" strokeWidth="1.8">
        <path d="M13 4L6.5 11 3 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--color-text-muted)',
        }}
      >
        Free plan available
      </span>
    </div>
  </div>
</div>

          {/* RIGHT COLUMN — Visual with iframe */}
          <div className="order-2 relative flex justify-center">
            {/* Phone Mockup with iframe */}
            <div
              className="relative"
              style={{
                width: '300px',
                height: '620px',
              }}
            >
              {/* Phone frame */}
              <div
                className="absolute inset-0 rounded-[40px] overflow-hidden"
                style={{
                  backgroundColor: 'white',
                  boxShadow: 'var(--shadow-phone)',
                  border: '8px solid #1a1a1a',
                }}
              >
                {/* Notch */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-[#1a1a1a] rounded-b-2xl z-20"
                />

                {/* Inner screen with iframe */}
                <iframe
                  src={templatePreviewUrl}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  title="Invitation Preview"
                />
              </div>

              {/* Floating accent elements with animations */}
              {/* Top-right: small white card badge - float animation */}
              <div
                className="absolute -top-3 -right-6 px-3 py-2 rounded-xl shadow-lg text-xs font-medium animate-float"
                style={{
                  backgroundColor: 'white',
                  color: 'var(--color-text-heading)',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                💚 RSVP!
              </div>

              {/* Bottom-left: countdown chip - float animation with delay */}
              <div
                className="absolute -bottom-3 -left-6 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                style={{
                  backgroundColor: 'white',
                  boxShadow: 'var(--shadow-card)',
                  animation: 'float 3s ease-in-out infinite 0.5s',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4A7C59"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-accent-primary)',
                  }}
                >
                  Countdown
                </span>
              </div>

              {/* Floating dots with different animations */}
              <div
                className="absolute w-3 h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: '#F5C518',
                  top: '5%',
                  right: '-8%',
                  animation: 'float 2.5s ease-in-out infinite 0.2s',
                }}
              />
              <div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: '#4A7C59',
                  bottom: '20%',
                  left: '-10%',
                  animation: 'float 3s ease-in-out infinite 0.8s',
                }}
              />
              <div
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: '#E07B5A',
                  top: '55%',
                  right: '-5%',
                  animation: 'float 2.8s ease-in-out infinite 0.4s',
                }}
              />
              
              {/* Additional decorative floating elements */}
              <div
                className="absolute w-4 h-4 rounded-full opacity-60"
                style={{
                  backgroundColor: 'var(--color-accent-secondary)',
                  top: '30%',
                  right: '-12%',
                  animation: 'float 4s ease-in-out infinite 1s',
                }}
              />
              <div
                className="absolute w-2 h-2 rounded-full opacity-80"
                style={{
                  backgroundColor: '#F5C518',
                  bottom: '35%',
                  left: '-6%',
                  animation: 'float 3.5s ease-in-out infinite 0.3s',
                }}
              />
            </div>

            {/* Background decorative blobs */}
            <div
              className="absolute top-1/4 -right-8 w-32 h-32 rounded-full opacity-20 blur-xl"
              style={{
                backgroundColor: 'var(--color-accent-primary)',
                animation: 'pulse-glow 4s ease-in-out infinite',
              }}
            />
            <div
              className="absolute bottom-1/4 -left-8 w-24 h-24 rounded-full opacity-15 blur-xl"
              style={{
                backgroundColor: 'var(--color-accent-coral)',
                animation: 'pulse-glow 5s ease-in-out infinite 1s',
              }}
            />
          </div>
        </div>
      </div>

      {/* Inline keyframe animations for this component */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
