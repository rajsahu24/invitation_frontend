'use client';

import { useEffect, useRef, useState } from 'react';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent-primary)' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent-primary)' }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const cards = [
  {
    num: 1,
    col: 1,
    title: 'More Than a Card, PDF, or Video',
    content: (
      <>
        <div className="space-y-3 mb-6">
          {['Cards get lost', 'PDFs feel forgettable', 'Videos are watched once'].map((t) => (
            <div key={t} className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
              <CrossIcon />
              <span className="text-[15px] font-medium" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>{t}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-r-xl border-l-4 text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-accent-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
          InviteEra is a living invitation — guests revisit it, feel connected, and remember your celebration.
        </div>
      </>
    ),
  },
  {
    num: 2,
    col: 2,
    title: 'One Link. Everything Your Guests Need.',
    content: (
      <>
        <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>With InviteEra, your guests get:</p>
        <div className="space-y-5 mb-8">
          {['Event details, date & time', 'Venue with Google Maps', 'Photos & videos', 'Countdown & updates'].map((t) => (
            <div key={t} className="flex items-start gap-4">
              <CheckIcon />
              <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>{t}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
          No confusion. No multiple forwards. Just one clean link.
        </div>
      </>
    ),
  },
  {
    num: 3,
    col: 3,
    title: 'Easy for Everyone',
    content: (
      <>
        <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>You don't need:</p>
        <div className="space-y-3 mb-8">
          {['Designers', 'Technical skills', 'Long setup time'].map((t) => (
            <div key={t} className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
              <CrossIcon />
              <span className="text-[15px] font-medium" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>{t}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
          Create your invitation in just 2 minutes, even if it's your first time.
        </div>
      </>
    ),
  },
  {
    num: 4,
    col: 1,
    title: 'Share Instantly, Update Anytime',
    content: (
      <div className="space-y-5">
        {['Share via WhatsApp, Instagram, or SMS', 'Made a change? Update once — everyone sees it instantly', 'No reprinting. No resending PDFs.'].map((t) => (
          <div key={t} className="flex items-start gap-4">
            <CheckIcon />
            <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>{t}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: 5,
    col: 2,
    title: 'Feels Personal, Not Generic',
    content: (
      <>
        <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>InviteEra invitations:</p>
        <div className="space-y-5 mb-8">
          {['Look warm and modern', 'Feel personal to your family', 'Suit weddings, birthdays, baby events, and more'].map((t) => (
            <div key={t} className="flex items-start gap-4">
              <CheckIcon />
              <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>{t}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-r-xl border-l-4 text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-accent-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
          It feels like your story, not a template.
        </div>
      </>
    ),
  },
  {
    num: 6,
    col: 3,
    title: 'Always With Your Guests',
    content: (
      <>
        <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Unlike cards or videos:</p>
        <div className="space-y-5">
          {['An InviteEra invite stays on the phone', 'Easy to reopen on the event day', 'Perfect for directions and reminders'].map((t) => (
            <div key={t} className="flex items-start gap-4">
              <CheckIcon />
              <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>{t}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    num: 7,
    col: 1,
    title: 'Paperless & Thoughtful',
    content: (
      <>
        <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Choosing InviteEra means:</p>
        <div className="space-y-5 mb-8">
          {['No paper waste', 'No printing', 'A small step toward saving trees 🌿'].map((t) => (
            <div key={t} className="flex items-start gap-4">
              <CheckIcon />
              <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>{t}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-r-xl border-l-4 text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-accent-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
          Celebrate joy while caring for the future.
        </div>
      </>
    ),
  },
  {
    num: 8,
    col: 2,
    title: 'Trusted by Thousands of Families',
    content: (
      <>
        <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>InviteEra is already loved by thousands of families who wanted something:</p>
        <div className="space-y-5">
          {['Simple', 'Meaningful', 'Modern', 'And memorable'].map((t) => (
            <div key={t} className="flex items-start gap-4">
              <CheckIcon />
              <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>{t}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

// desktop column order: col1 → order 0,3,6 | col2 → order 1,4,7 | col3 → order 2,5
const colOrderMap: Record<number, string> = { 1: 'md:col-start-1', 2: 'md:col-start-2', 3: 'md:col-start-3' };

export default function WhyChooseWebsite() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className={`py-[100px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="container-landing">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="mx-auto mb-4"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 700, color: 'var(--color-text-heading)' }}
          >
            Why Choose an Invitation{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--color-accent-primary)' }}>Website?</span>
          </h2>
          <p className="text-lg italic" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-body)' }}>
            A feeling. A memory. A moment shared.
          </p>
        </div>

        {/* Cards grid — 1 col on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto">
          {cards.map((card) => (
            <div
              key={card.num}
              className={`rounded-[20px] p-8 transition-transform duration-300 hover:-translate-y-1 ${colOrderMap[card.col]}`}
              style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 text-lg"
                style={{ backgroundColor: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}
              >
                {card.num}
              </div>
              <h3
                className="text-xl lg:text-2xl font-bold mb-6 leading-snug"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}
              >
                {card.title}
              </h3>
              {card.content}
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className="mt-16 mx-auto max-w-4xl text-center p-8 md:p-10 rounded-[24px] shadow-sm relative overflow-hidden"
          style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-bg-section-alt)' }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 opacity-10 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: 'var(--color-accent-primary)' }} />
          <div className="absolute bottom-0 right-0 w-40 h-40 opacity-10 translate-x-1/3 translate-y-1/3 rounded-full" style={{ backgroundColor: 'var(--color-accent-primary)' }} />
          <p
            className="text-[20px] md:text-[24px] font-bold italic leading-relaxed relative z-10"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}
          >
            Your invitation becomes an experience — simple to create, beautiful to share,{' '}
            <br className="hidden lg:block" />and easy to remember.
          </p>
        </div>
      </div>
    </section>
  );
}
