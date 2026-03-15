'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useHostStore } from '../../../lib/store';
import Image from 'next/image';
import Link from 'next/link';
import SVGComponent from '../landingV2/HomeLogo';

export default function HostLoginPage() {
  const { login, signup } = useHostStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, name, phone } = formData;
    
    if (!email || !password) return;
    if (isSignUp && (!name || !phone)) return;

    setIsLoading(true);
    setError('');

    
    try {
      if (isSignUp) {
        // Create account proxy call
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
         
          body: JSON.stringify({
            name,
            email,
            password,
            phone,
            role: 'host'
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setSuccess('Account created successfully!');
          
          // Store user data from API response
          signup({ 
            id: data.user?.id || data.id,
            name: data.user?.name || name,
            email: data.user?.email || email,
            phone: data.user?.phone || phone
          });
          router.push('/host');
        } else {
          const error = await response.json();
          setError(error.message || 'Signup failed');
        }
      } else {
         
        // Login proxy call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          
          body: JSON.stringify({
            email,
            password
          }),
        });
       
        if (response.ok) {
          const data = await response.json();
          setSuccess('Login successful!');
          
          const userData = {
            id: data.user?.id || data.id,
            name: data.user?.name || data.name,
            email: data.user?.email || email
          };
          login(userData);
          console.log('Login successful');
          router.push('/host');
        } else {
          const error = await response.json();
          setError(error.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div 
      className="min-h-screen flex"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* LEFT COLUMN - Brand/Navigation Section */}
      <div 
        className="hidden  lg:flex lg:w-1/2 relative flex-col justify-center p-12"
        style={{
          backgroundColor: 'var(--color-accent-primary)',
        }}
      >
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [-20, 20, -20],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-16 h-16 rounded-full opacity-20"
            style={{ backgroundColor: 'var(--color-accent-secondary)' }}
          />
          <motion.div 
            animate={{ 
              y: [20, -20, 20],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 w-12 h-12 rounded-full opacity-20"
            style={{ backgroundColor: 'var(--color-accent-coral)' }}
          />
          <motion.div 
            animate={{ 
              y: [-15, 15, -15],
              rotate: [0, 3, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 left-24 w-20 h-20 rounded-full opacity-15"
            style={{ backgroundColor: 'white' }}
          />
        </div>

        {/* Logo */}
        {/* <Link href="/" className="flex items-center  gap-1.5 relative z-10">
            <SVGComponent />
        
          
        </Link> */}
                <Link 
          href="/" 
          className="top-16 absolute flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity  z-10"
          style={{ color: 'var(--color-text-white)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        {/* Hero Content */}
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 
              className="text-4xl lg:text-5xl font-bold mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-white)',
                lineHeight: 1.2,
              }}
            >
              Create Beautiful{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
                Invitations
              </span>{' '}
              That Impress
            </h1>
            <p 
              className="text-lg opacity-80 max-w-md"
              style={{
                color: 'var(--color-text-white)',
                lineHeight: 1.6,
              }}
            >
              Join thousands of hosts who trust IndoorLoop to create stunning digital invitations for their special moments.
            </p>
          </motion.div>

          {/* Trust indicators */}
          <div 
            className="flex items-center gap-6 mt-10 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" viewBox="0 0 16 16" fill="#F5C518">
                    <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75L8 1z" />
                  </svg>
                ))}
              </div>
              <span style={{ color: 'var(--color-text-white)', fontSize: '14px', fontWeight: 600 }}>
                4.9 Rating
              </span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
            <span style={{ color: 'var(--color-text-white)', fontSize: '14px' }}>
              10,000+ Users
            </span>
          </div>
        </div>

        {/* Back to home link */}

      </div>

      {/* RIGHT COLUMN - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div 
          layout
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Image 
              width={500} 
              height={500} 
              className="h-10 w-auto" 
              src="/homelogo.svg" 
              alt="home logo" 
            />
            <span 
              className="text-xl font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-heading)',
              }}
            >
              InviteEra
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              layoutId="title" 
              className="text-3xl font-bold mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-heading)',
              }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </motion.h1>
            <motion.p 
              layoutId="subtitle" 
              className="text-base"
              style={{ color: 'var(--color-text-body)' }}
            >
              {isSignUp 
                ? 'Start creating beautiful invitations for your special moments' 
                : 'Sign in to continue your hosting journey'}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl text-sm font-medium"
                style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  color: '#dc2626',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                }}
              >
                {error}
              </motion.div>
            )}
            
            {/* Success Message */}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl text-sm font-medium"
                style={{
                  backgroundColor: 'rgba(74, 124, 89, 0.1)',
                  color: 'var(--color-accent-primary)',
                  border: '1px solid rgba(74, 124, 89, 0.2)',
                }}
              >
                {success}
              </motion.div>
            )}

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/auth/google`}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-[50px] transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: 'white',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-heading)',
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Continue with Google</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div 
                  className="w-full" 
                  style={{ borderTop: '1px solid var(--color-border)' }}
                />
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-4 text-sm font-medium"
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-muted)' 
                  }}
                >
                  Or continue with email
                </span>
              </div>
            </div>

            <AnimatePresence mode='popLayout'>
              {isSignUp && (
                <>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key="name-field"
                  >
                    <label 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: 'var(--color-text-heading)' }}
                    >
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-[16px] border-2 outline-none transition-all"
                      style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'white',
                        color: 'var(--color-text-heading)',
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key="phone-field"
                  >
                    <label 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: 'var(--color-text-heading)' }}
                    >
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-[16px] border-2 outline-none transition-all"
                      style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'white',
                        color: 'var(--color-text-heading)',
                      }}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <motion.div layout>
              <label 
                className="block text-sm font-semibold mb-2"
                style={{ color: 'var(--color-text-heading)' }}
              >
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-[16px] border-2 outline-none transition-all"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'white',
                  color: 'var(--color-text-heading)',
                }}
              />
            </motion.div>

            <motion.div layout>
              <label 
                className="block text-sm font-semibold mb-2"
                style={{ color: 'var(--color-text-heading)' }}
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-[16px] border-2 outline-none transition-all"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'white',
                  color: 'var(--color-text-heading)',
                }}
              />
            </motion.div>

            <motion.button
              layout
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-base font-semibold rounded-[50px] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
              style={{
                backgroundColor: 'var(--color-accent-primary)',
                color: 'var(--color-text-white)',
                boxShadow: '0 4px 16px rgba(74, 124, 89, 0.35)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a6347';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(74,124,89,0.45)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-accent-primary)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(74,124,89,0.35)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <motion.div layout className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
            <p 
              className="text-sm mb-4"
              style={{ color: 'var(--color-text-body)' }}
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
            </p>
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold transition-all duration-300"
              style={{ 
                color: 'var(--color-accent-primary)',
              }}
            >
              {isSignUp ? 'Sign in to existing account' : 'Create your free account'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
