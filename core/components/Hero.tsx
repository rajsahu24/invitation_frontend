"use client";

import { motion } from "framer-motion";

interface HeroProps {
  eventTitle: string;
  hostName: string;
  date: string;
  time: string;
  location: string;
  coverImage?: string;
}

export default function Hero({
  eventTitle,
  hostName,
  date,
  time,
  location,
  coverImage,
}: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 animate-gradient" />
      
      {/* Overlay pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] repeat" />
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl opacity-60"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-pink-400 rounded-full blur-xl opacity-60"
        animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 right-20 w-16 h-16 bg-cyan-400 rounded-full blur-xl opacity-50"
        animate={{ y: [0, -15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Host badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-2xl">👋</span>
          <span className="text-white font-medium">Hosted by {hostName}</span>
        </motion.div>

        {/* Event title */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {eventTitle}
        </motion.h1>

        {/* Date & Time card */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-3">
            <span className="text-3xl">📅</span>
            <div className="text-left">
              <p className="text-white/80 text-sm">Date</p>
              <p className="text-white font-semibold">{date}</p>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-3">
            <span className="text-3xl">🕐</span>
            <div className="text-left">
              <p className="text-white/80 text-sm">Time</p>
              <p className="text-white font-semibold">{time}</p>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-3">
            <span className="text-3xl">📍</span>
            <div className="text-left">
              <p className="text-white/80 text-sm">Location</p>
              <p className="text-white font-semibold">{location}</p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
