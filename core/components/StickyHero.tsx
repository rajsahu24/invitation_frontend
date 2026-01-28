"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Calendar, Users } from "lucide-react";

interface StickyHeroProps {
  eventTitle: string;
  hostName: string;
  date: string;
  location: string;
  totalGuests: number;
}

export default function StickyHero({
  eventTitle,
  hostName,
  date,
  location,
  totalGuests,
}: StickyHeroProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const blur = useTransform(scrollY, [100, 200], ["0px", "10px"]);

  return (
    <motion.div
      className="sticky top-0 z-50"
      style={{ opacity }}
    >
      {/* Hero Image/GIF Container */}
      <motion.div
        className="relative h-[70vh] min-h-[500px] overflow-hidden"
        style={{ scale, filter: blur }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 via-pink-500 to-cyan-400 animate-gradient" />
        
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-8 px-6">
          {/* Host badge */}
          <motion.div
            className="absolute top-6 left-6 right-6 flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
              <span className="text-2xl">👋</span>
              <span className="text-white font-medium">Hosted by {hostName}</span>
            </div>
            
            <button className="bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </motion.div>

          {/* Event title */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {eventTitle}
          </motion.h1>

          {/* Quick info cards */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-4 py-3">
              <Calendar className="w-5 h-5 text-white/80" />
              <span className="text-white font-medium">{date}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-white/80" />
              <span className="text-white font-medium">{location}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-4 py-3">
              <Users className="w-5 h-5 text-white/80" />
              <span className="text-white font-medium">{totalGuests} guests</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
