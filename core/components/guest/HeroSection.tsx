'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Calendar, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

// Floating Emoji Component
const FloatingEmoji = ({ delay, emoji, left }: { delay: number; emoji: string; left: string }) => (
  <motion.div
    initial={{ y: '100%', opacity: 0 }}
    animate={{ y: '-120%', opacity: [0, 1, 1, 0] }}
    transition={{ 
      duration: 10, 
      repeat: Infinity, 
      delay, 
      ease: "linear"
    }}
    className="absolute bottom-0 text-4xl pointer-events-none"
    style={{ left }}
  >
    {emoji}
  </motion.div>
);

interface HeroSectionProps {
  title: string;
  posterImage: string;
  hostName: string;
  hostAvatar: string;
  onRSVPClick: () => void;
}

export default function HeroSection({ title, posterImage, hostName, hostAvatar, onRSVPClick }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-[85vh] md:h-[600px] overflow-hidden rounded-b-3xl md:rounded-3xl shadow-2xl bg-black">
      {/* Animated Poster (Ken Burns) */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        animate={{ scale: [1, 1.15] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      >
        <img
          src={posterImage} 
          alt="Event Poster" 
           
          className="object-cover opacity-60" 
          
        />
      </motion.div>

      {/* Vibe Layer (Floating Confetti/Emojis) */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingEmoji delay={0} emoji="✨" left="10%" />
          <FloatingEmoji delay={2} emoji="🌸" left="25%" />
          <FloatingEmoji delay={5} emoji="🥂" left="70%" />
          <FloatingEmoji delay={3.5} emoji="💍" left="85%" />
          <FloatingEmoji delay={1} emoji="🎉" left="50%" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 max-w-2xl mx-auto w-full text-center md:text-left"
        >
          {/* Host Credit */}
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
             <div className="relative w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden">
                <img src={hostAvatar} alt={hostName} className="object-cover" />
             </div>
             <p className="text-white/80 text-sm font-medium backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full">
               Hosted by {hostName}
             </p>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight font-serif">
            {title}
          </h1>

          {/* Quick Actions */}
          <div className="pt-6">
            <button 
              onClick={onRSVPClick}
              className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-100 transform transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-yellow-500" />
              RSVP Now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
