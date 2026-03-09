'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Templates', href: '/templates' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about-us' },

];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[--color-bg-primary]/95 backdrop-blur-[12px] border-b border-[--color-border]'
          : 'bg-[--color-bg-primary]'
      }`}
      style={{
        height: '68px',
      }}
    >
      <div className="container-landing h-full">
        <div className="flex items-center justify-between h-full">
          {/* LEFT — Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* Leaf SVG Icon */}
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
                fill="#4A7C59"
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
                color: 'var(--color-text-heading)',
              }}
            >
              InviteEra
            </span>
          </Link>

          {/* CENTER — Nav Links (hidden on mobile, shown ≥ 768px) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-normal transition-colors duration-200 hover:text-[--color-accent-primary] hover:underline"
                style={{ color: 'var(--color-text-body)' }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* RIGHT — Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium rounded-[50px] transition-all duration-200"
              style={{
                border: '1.5px solid var(--color-accent-primary)',
                color: 'var(--color-accent-primary)',
              }}
            >
              Log In
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium rounded-[50px] transition-all duration-200 hover:bg-[#3a6347]"
              style={{
                backgroundColor: 'var(--color-accent-primary)',
                color: 'var(--color-text-white)',
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger button (< 768px) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 transition-colors duration-200"
            style={{ color: 'var(--color-text-heading)' }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div
          className="md:hidden absolute top-[68px] left-0 right-0 bg-[--color-bg-primary] border-b border-[--color-border] shadow-lg"
          style={{ maxHeight: 'calc(100vh - 68px)', overflowY: 'auto' }}
        >
          <div className="px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-base font-normal border-b border-[--color-border] transition-colors duration-200 hover:text-[--color-accent-primary]"
                style={{ color: 'var(--color-text-body)' }}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-6 pb-4 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center px-5 py-3 text-sm font-medium rounded-[50px] transition-all duration-200"
                style={{
                  border: '1.5px solid var(--color-accent-primary)',
                  color: 'var(--color-accent-primary)',
                }}
              >
                Log In
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center px-5 py-3 text-sm font-medium rounded-[50px] transition-all duration-200 hover:bg-[#3a6347]"
                style={{
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'var(--color-text-white)',
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
