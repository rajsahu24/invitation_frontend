'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Templates', href: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/templates` },
  { name: 'About', href: '/about-us' },
  { name: 'Blog', href: '/blog' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { scrollY } = useScroll();
  
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    
    const token = getCookie('token');
    setIsLoggedIn(!!token);
  }, []);
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(16px)']
  );

  const shadow = useTransform(
    scrollY,
    [0, 50],
    ['none', '0 4px 20px -5px rgba(0, 0, 0, 0.05)']
  );

  return (
    <motion.nav
      style={{ 
        backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.98)' : backgroundColor, 
        backdropFilter: isOpen ? 'blur(16px)' : backdropBlur,
        boxShadow: shadow
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOpen ? 'bg-white' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Inviteera
            </span> */}
            <Image width={500} height={500} className="h-40 mt-2 -ml-16 sm:ml-auto  lg:h-16    w-auto"  src="/homelogo.svg" alt="home logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            ) : (
                <Link
                href="/host"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors z-50"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white/50"
            >
              <div className="pt-4 pb-8 space-y-4 px-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-lg text-gray-800 hover:text-blue-600 font-semibold py-2 border-b border-gray-100 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-6">
                  {!isLoggedIn ? (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block text-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200"
                    >
                      Get Started
                    </Link>
                  ) : (
                    <Link
                      href="/host"
                      onClick={() => setIsOpen(false)}
                      className="block text-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
