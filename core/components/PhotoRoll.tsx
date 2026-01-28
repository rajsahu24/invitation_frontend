"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Sample photos
const samplePhotos = [
  "/photo1.jpg",
  "/photo2.jpg",
  "/photo3.jpg",
  "/photo4.jpg",
  "/photo5.jpg",
  "/photo6.jpg",
];

// Fallback gradient colors for demo
const gradientPhotos = [
  "from-pink-400 to-rose-500",
  "from-violet-500 to-purple-600",
  "from-cyan-400 to-blue-500",
  "from-amber-400 to-orange-500",
  "from-green-400 to-emerald-500",
  "from-fuchsia-500 to-pink-600",
];

export default function PhotoRoll() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % samplePhotos.length : 0));
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + samplePhotos.length) % samplePhotos.length : 0));
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Photo Roll</h3>
        <button className="text-violet-600 text-sm font-medium hover:text-violet-700">
          Add photo
        </button>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-2">
        {samplePhotos.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openLightbox(index)}
            className={`aspect-square rounded-xl bg-gradient-to-br ${gradientPhotos[index]} cursor-pointer overflow-hidden shadow-md hover:shadow-xl transition-shadow`}
          >
            {/* Placeholder content */}
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl">📸</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-4 p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Photo */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`w-full max-w-md aspect-square mx-4 rounded-2xl bg-gradient-to-br ${gradientPhotos[selectedIndex]} flex items-center justify-center`}
            >
              <span className="text-6xl">📸</span>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
              <span className="text-white text-sm">
                {selectedIndex + 1} of {samplePhotos.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
