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

export default function WhyChooseWebsite() {
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
      id="why-choose-us"
      ref={sectionRef}
      className={`py-[100px] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="container-landing">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="mx-auto mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 42px)',
              fontWeight: 700,
              color: 'var(--color-text-heading)',
            }}
          >
            Why Choose an Invitation{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--color-accent-primary)' }}>Website?</span>
          </h2>
          <p
            className="text-lg italic"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-body)',
            }}
          >
            A feeling. A memory. A moment shared.
          </p>
        </div>

        {/* Masonry Layout */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 max-w-[1200px] mx-auto">
          {/* Column 1 */}
          <div className="flex-1 flex flex-col gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="rounded-[20px] p-8 transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 text-lg" style={{ backgroundColor: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>1</div>
              <h3 className="text-xl lg:text-2xl font-bold mb-6 leading-snug" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>More Than a Card, PDF, or Video</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-200" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                  <CrossIcon />
                  <span className="text-[15px] font-medium" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Cards get lost</span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-200" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                  <CrossIcon />
                  <span className="text-[15px] font-medium" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>PDFs feel forgettable</span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-200" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                  <CrossIcon />
                  <span className="text-[15px] font-medium" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Videos are watched once</span>
                </div>
              </div>
              <div className="p-5 rounded-r-xl border-l-4 text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-accent-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
                Bigdates.ai is a living invitation guests revisit it, feel connected, and remember your celebration.
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-[20px] p-8 transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 text-lg" style={{ backgroundColor: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>4</div>
              <h3 className="text-xl lg:text-2xl font-bold mb-6 leading-snug" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Share Instantly, Update Anytime</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Share via WhatsApp, Instagram, or SMS</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Made a change? Update once — everyone sees it instantly</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>No reprinting. No resending PDFs.</span>
                </div>
              </div>
            </div>

            {/* Card 7 */}
            <div className="rounded-[20px] p-8 transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 text-lg" style={{ backgroundColor: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>7</div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 leading-snug" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Paperless & Thoughtful</h3>
              <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Choosing Bigdates.ai means:</p>
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>No paper waste</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>No printing</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>A small step toward saving trees 🌿</span>
                </div>
              </div>
              <div className="p-5 rounded-r-xl border-l-4 text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-accent-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
                Celebrate joy while caring for the future.
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex-1 flex flex-col gap-6 lg:gap-8">
            {/* Card 2 */}
            <div className="rounded-[20px] p-8 transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 text-lg" style={{ backgroundColor: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>2</div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 leading-snug" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>One Link. Everything Your Guests Need.</h3>
              <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>With Bigdates.ai, your guests get:</p>
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Event details, date & time</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Venue with Google Maps</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Photos & videos</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Countdown & updates</span>
                </div>
              </div>
              <div className="p-5 rounded-xl text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
                No confusion. No multiple forwards. Just one clean link.
              </div>
            </div>

            {/* Card 5 */}
            <div className="rounded-[20px] p-8 transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 text-lg" style={{ backgroundColor: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>5</div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 leading-snug" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Feels Personal, Not Generic</h3>
              <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Bigdates.ai invitations:</p>
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Look warm and modern</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Feel personal to your family</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Suit weddings, birthdays, baby events, and more</span>
                </div>
              </div>
              <div className="p-5 rounded-r-xl border-l-4 text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-accent-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
                It feels like your story, not a template.
              </div>
            </div>

            {/* Card 8 */}
            <div className="rounded-[20px] p-8 transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 text-lg" style={{ backgroundColor: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>8</div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 leading-snug" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Trusted by Thousands of Families</h3>
              <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Bigdates.ai is already loved by thousands of families who wanted something:</p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Simple</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Meaningful</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Modern</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>And memorable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex-1 flex flex-col gap-6 lg:gap-8">
            {/* Card 3 */}
            <div className="rounded-[20px] p-8 transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 text-lg" style={{ backgroundColor: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>3</div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 leading-snug" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Easy for Everyone</h3>
              <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>You don't need:</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-200" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                  <CrossIcon />
                  <span className="text-[15px] font-medium" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Designers</span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-200" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                  <CrossIcon />
                  <span className="text-[15px] font-medium" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Technical skills</span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-200" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                  <CrossIcon />
                  <span className="text-[15px] font-medium" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Long setup time</span>
                </div>
              </div>
              <div className="p-5 rounded-xl text-[15px] font-medium leading-relaxed" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>
                Create your invitation in just 2 minutes, even if it's your first time.
              </div>
            </div>

            {/* Card 6 */}
            <div className="rounded-[20px] p-8 transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 text-lg" style={{ backgroundColor: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>6</div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 leading-snug" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Always With Your Guests</h3>
              <p className="text-[15px] mb-6 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Unlike cards or videos:</p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>A Bigdates.ai invite stays on the phone</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Easy to reopen on the event day</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>Perfect for directions and reminders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Banner */}
        <div className="mt-16 mx-auto max-w-4xl text-center p-8 md:p-10 rounded-[24px] shadow-sm relative overflow-hidden" 
             style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-bg-section-alt)' }}>
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 opacity-10 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: 'var(--color-accent-primary)' }}></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 opacity-10 translate-x-1/3 translate-y-1/3 rounded-full" style={{ backgroundColor: 'var(--color-accent-primary)' }}></div>
          
          <p className="text-[20px] md:text-[24px] font-bold italic leading-relaxed relative z-10" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>
            Your invitation becomes an experience simple to create, beautiful to share, <br className="hidden lg:block" /> and easy to remember.
          </p>
        </div>
      </div>
    </section>
  );
}
