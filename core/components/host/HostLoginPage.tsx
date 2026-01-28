'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, User, Phone, Mail, Loader2, Sparkles, Heart } from 'lucide-react';
import { useHostStore } from '../../../lib/store';

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
    console.log(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/auth/login`)
    if (!email || !password) return;
    if (isSignUp && (!name || !phone)) return;

    setIsLoading(true);
    setError('');
    // setSuccess('');
    
    try {
      if (isSignUp) {
        // Create account API call
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/auth/register`, {
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
         
        // Login API call
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/auth/login`, {
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
          
          // Store user data from API response
          const userData = {
            id: data.user?.id || data.id,
            name: data.user?.name || data.name,
            email: data.user?.email || email
          };
          login(userData);
          console.log("Login successful! User ID:", userData.id, "User data:", success);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl opacity-20"
        >
          💙
        </motion.div>
        <motion.div 
          animate={{ 
            y: [20, -20, 20],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-16 text-4xl opacity-20"
        >
          ⭐
        </motion.div>
        <motion.div 
          animate={{ 
            y: [-15, 15, -15],
            rotate: [0, 3, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 text-5xl opacity-20"
        >
          🎊
        </motion.div>
        <motion.div 
          animate={{ 
            y: [25, -25, 25],
            rotate: [0, -3, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-10 text-4xl opacity-20"
        >
          💎
        </motion.div>
      </div>

      <motion.div 
        layout
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            layoutId="icon"
            className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <div className="text-4xl">
              {isSignUp ? '🌟' : '💎'}
            </div>
          </motion.div>
          
          <motion.h1 layoutId="title" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {isSignUp ? 'Join IndoorLoop' : 'Welcome Back'}
          </motion.h1>
          <motion.p layoutId="subtitle" className="text-gray-600 font-medium">
            {isSignUp ? 'Create beautiful invitations for your special moments' : 'Continue your hosting journey'}
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}
          
          {/* Success Message */}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-medium"
            >
              {success}
            </motion.div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/auth/google`}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <input
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 text-gray-900 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all pl-12 bg-gray-50 focus:bg-white"
                    />
                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </motion.div>

                <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   key="phone-field"
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-4 text-gray-900 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all pl-12 bg-gray-50 focus:bg-white"
                    />
                    <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <motion.div layout>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
                <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 text-gray-900 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all pl-12 bg-gray-50 focus:bg-white"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </motion.div>

          <motion.div layout>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-4 text-gray-900 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all pl-12 bg-gray-50 focus:bg-white"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </motion.div>

          <motion.button
            layout
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-8 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {isSignUp ? (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Create Account
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Sign In
                      </>
                    )}
                    <ArrowRight className="w-5 h-5" />
                </>
            )}
          </motion.button>
        </form>

        <motion.div layout className="mt-8 pt-6 border-t border-gray-200 text-center">
             <p className="text-gray-600 text-sm mb-4 font-medium">
                {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
             </p>
             <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
                {isSignUp ? 'Sign in to existing account' : 'Create your free account'}
             </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
