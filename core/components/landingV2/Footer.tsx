'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const footerLinks = {
  company: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about-us' },
    { name: 'Blog', href: '/blog' },
    { name: 'Pricing', href: '#pricing' },
  ],
  support: [
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
  ],
};

export default function Footer() {
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
    <footer
      ref={sectionRef}
      className={`py-16 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      <div className="container-landing">
        {/* 4-column grid */}
        <div className="grid grid-cols-1  lg:grid-cols-2 justify-between gap-8 mb-12">
          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              {/* White leaf icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                  fill="white"
                />
                <path
                  d="M12 21C12 21 7 17 7 12C7 8.5 9 6 12 6C15 6 17 8.5 17 12C17 17 12 21 12 21Z"
                  fill="#7BAE7F"
                />
                <path
                  d="M12 6V16M12 16C13.5 14 15 12 17 12M12 16C10.5 14 9 12 7 12"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="text-xl font-bold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'white',
                }}
              >
                InviteEra
              </span>
            </div>

            {/* Tagline */}
            <p
              className="mb-4"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'white',
              }}
            >
              Let's Get In Touch
            </p>

            {/* Description */}
            <p
              className="mb-6"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 300,
                color: 'rgba(255, 255, 255, 0.55)',
                lineHeight: 1.6,
              }}
            >
              Creating beautiful digital invitations for life's special moments.
            </p>

            {/* Social icons row */}
            <div className="flex items-center gap-2.5">
              {/* Instagram */}
              <a
                href="#"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
                aria-label="Instagram"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0-.012 3.584-.069 4.849 3.205-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
                aria-label="Facebook"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="#"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
                aria-label="Pinterest"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>



          {/* Column 3 — Client Office */}


          {/* Column 4 — Links */}
          <div className="grid grid-cols-2 gap-8">
            {/* Company links */}
            <div>
              <h4
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                Company
              </h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-[--color-accent-secondary]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.55)',
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h4
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                Support
              </h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-[--color-accent-secondary]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.55)',
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
