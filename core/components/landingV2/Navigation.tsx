'use client';

import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SVGComponent from './HomeLogo'
import { useHostStore } from '@/lib/store';
import { useRouter } from 'next/navigation';


const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Templates', href: '/templates' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about-us' },
  {name:'FAQ',href:'/faq'}
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useHostStore();
  const router = useRouter();

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20  ${
        scrolled
          ? 'bg-[--color-bg-primary]/95 backdrop-blur-[12px] border-b border-[--color-border]'
          : 'bg-[--color-bg-primary]'
      }`}
    >
      {/* Background transitions handled safely inside if needed, but sticky avoids the containing block transform issue */}
      <div className=" container-landing h-full">
        <div className="flex items-center justify-between h-full ">
          {/* LEFT — Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* Leaf SVG Icon */}            
            {/* <Image width={500} height={500} className="h-13 mt-2 -ml-10 sm:ml-auto  lg:h-16    w-auto"  src="/homelogo.svg" alt="home logo" /> */}
            <SVGComponent />

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
            {user ? (
              // Logged in state - show Dashboard and Sign Out
              <>
                <Link
                  href="/host"
                  className="px-5 py-2 text-sm font-medium rounded-[50px] transition-all duration-200 flex items-center gap-2"
                  style={{
                    border: '1.5px solid var(--color-accent-primary)',
                    color: 'var(--color-accent-primary)',
                  }}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    router.push('/');
                  }}
                  className="px-5 py-2 text-sm font-medium rounded-[50px] transition-all duration-200 flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--color-text-body)',
                    color: 'var(--color-text-white)',
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              // Not logged in - show Log In and Get Started
              <>
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
              </>
            )}
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
          className="md:hidden fixed top-20 left-0 right-0 border-b border-[--color-border] shadow-lg"
          style={{ 
            maxHeight: 'calc(100vh - 80px)', 
            overflowY: 'auto',
            backgroundColor: '#F7F5F0',
            zIndex: 999
          }}
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
              {user ? (
                // Logged in state - show Dashboard and Sign Out
                <>
                  <Link
                    href="/host"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-5 py-3 text-sm font-medium rounded-[50px] transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      border: '1.5px solid var(--color-accent-primary)',
                      color: 'var(--color-accent-primary)',
                    }}
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      setIsOpen(false);
                      router.push('/');
                    }}
                    className="block text-center px-5 py-3 text-sm font-medium rounded-[50px] transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: 'var(--color-text-body)',
                      color: 'var(--color-text-white)',
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                // Not logged in - show Log In and Get Started
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
