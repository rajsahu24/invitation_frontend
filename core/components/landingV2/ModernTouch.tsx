'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Print-ready high-resolution files',
    description: 'Download stunning printable versions in multiple formats',
  },
  {
    title: 'Editable templates ready in minutes',
    description: 'Customize every detail with our easy-to-use editor',
  },
  {
    title: 'Designed by professional artists',
    description: 'Beautiful designs crafted by industry experts',
  },
];

export default function ModernTouch() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-16 md:py-24 relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--color-accent-primary)' }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--color-accent-coral)' }}
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <div className="container-landing relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              backgroundColor: 'rgba(74, 124, 89, 0.1)',
              color: 'var(--color-accent-primary)',
            }}
          >
            ✦ Best of Both Worlds
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-heading)',
            }}
          >
            Modern{' '}
            <span
              className="italic"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              Touch
            </span>{' '}
            to Traditional
          </h2>
          <p
            className="text-base max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-body)',
            }}
          >
            Experience the perfect blend of elegant paper invitations and modern digital convenience
          </p>
        </motion.div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT — Visual Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1 relative flex justify-center"
          >
            <div className="relative">
              {/* Ambient glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(74,124,89,0.15) 70%, transparent)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Stack of cards */}
              <div className="relative">
                {/* Back card - green gradient */}
                <motion.div
                  className="absolute top-0 left-4 rounded-2xl overflow-hidden shadow-xl hidden md:block"
                  style={{
                    width: '240px',
                    height: '340px',
                    background: 'linear-gradient(135deg, #4A7C59 0%, #3a6347 100%)',
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-3, -5, -3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isVisible ? { scale: 1 } : {}}
                      transition={{ delay: 0.8, type: 'spring' }}
                    >
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="mx-auto mb-4 opacity-80"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </motion.div>
                    <span
                      className="text-lg italic"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Save the Date
                    </span>
                    <span className="text-xs uppercase tracking-widest mt-2 opacity-80">
                      Wedding
                    </span>
                  </div>
                </motion.div>

                {/* Middle card - cream */}
                <motion.div
                  className="absolute top-8 left-16 rounded-2xl overflow-hidden shadow-xl hidden md:block"
                  style={{
                    width: '240px',
                    height: '340px',
                    background:
                      'linear-gradient(135deg, #FFF3D6 0%, #FEF3C7 100%)',
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [-1, -2, -1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <span
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-text-heading)',
                      }}
                    >
                      Sarah & James
                    </span>
                    <span
                      className="text-xs uppercase tracking-widest mt-2"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Wedding Invitation
                    </span>
                    <div className="mt-6 w-16 h-1 rounded-full" style={{ backgroundColor: 'var(--color-accent-primary)' }} />
                    <span
                      className="text-sm mt-4"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-body)',
                      }}
                    >
                      June 15, 2025
                    </span>
                  </div>
                </motion.div>

                {/* Front card - white with details */}
                <motion.div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    width: '240px',
                    height: '340px',
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-hover)',
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Decorative corners */}
                  <div className="absolute top-3 left-3 opacity-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L12 22M2 12L22 12"
                        stroke="#4A7C59"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="absolute top-3 right-3 opacity-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L12 22M2 12L22 12"
                        stroke="#4A7C59"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L12 22M2 12L22 12"
                        stroke="#4A7C59"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L12 22M2 12L22 12"
                        stroke="#4A7C59"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    {/* Couple names */}
                    <motion.h3
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-text-heading)',
                      }}
                      initial={{ opacity: 0 }}
                      animate={isVisible ? { opacity: 1 } : {}}
                      transition={{ delay: 0.6 }}
                    >
                      Sarah & James
                    </motion.h3>

                    {/* Decorative line */}
                    <motion.div
                      className="w-12 h-0.5 rounded-full mt-3"
                      style={{ backgroundColor: 'var(--color-accent-primary)' }}
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: 48 } : {}}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    />

                    {/* Event text */}
                    <p
                      className="text-xs uppercase tracking-[0.2em] mt-4"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      Request the honor of your presence
                    </p>

                    {/* Date & Time */}
                    <div className="mt-6 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                      <p
                        className="text-sm font-semibold"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-heading)',
                        }}
                      >
                        Saturday
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-accent-primary)',
                        }}
                      >
                        June 15, 2025
                      </p>
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-body)',
                        }}
                      >
                        at 4:00 PM
                      </p>
                    </div>

                    {/* QR Code placeholder */}
                    <div className="mt-4 flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-accent-primary)' }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2v-2zm0 4h2v2h-2v-2zm2 2h2v2h-2v-2zm0-4h2v2h-2v-2zm4 4h2v2h-2v-2zm0 4h2v2h-2v-2zm-8-8h2v2h-2v-2zm-4 0h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2z" />
                        </svg>
                      </div>
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        Scan to view
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            {/* Feature cards */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="group p-4 rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  whileHover={{ x: 8 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                      style={{
                        backgroundColor: 'rgba(74, 124, 89, 0.1)',
                        color: 'var(--color-accent-primary)',
                      }}
                    >
                      {index === 0 && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                          <rect x="6" y="14" width="12" height="8" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <h4
                        className="font-semibold mb-1 transition-colors duration-300"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-heading)',
                        }}
                      >
                        {feature.title}
                      </h4>
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-body)',
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: 'var(--color-accent-primary)' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap gap-8 mt-8 pt-6"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              {[
                { value: '100+', label: 'Templates' },
                { value: '10K+', label: 'Happy Users' },
                { value: '4.9', label: 'Rating' },
              ].map((stat, index) => (
                <div key={index}>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-accent-primary)',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="block text-xs"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
