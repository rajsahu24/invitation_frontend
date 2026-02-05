'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Template {
  id: string;
  template_name: string;
  template_type: string;
}

export default function Hero() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`);
        const data = await response.json();
        setTemplates(data.slice(0, 4)); // Show only first 2 templates
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Create Beautiful Invitations</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.1]"
        >
          Create Beautiful{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block md:inline mt-2 md:mt-0">
            Invitations
          </span>
          <br className="hidden md:block" />
          <span className="md:mt-0">in Minutes</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed px-4"
        >
          Design stunning event invitations with ease. Perfect for weddings, birthdays, 
          and corporate events. No design skills required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6"
        >
          <Link
            href="/login"
            className="w-full sm:w-auto group px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="w-full sm:w-auto px-10 py-4 bg-white text-gray-700 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-gray-100 flex items-center justify-center">
            View Examples
          </button>
        </motion.div>
      </div>
    </section>
  );
}
