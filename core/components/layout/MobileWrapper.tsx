"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MobileWrapperProps {
  children: ReactNode;
}

export default function MobileWrapper({ children }: MobileWrapperProps) {
  return (
    <div className="min-h-screen">
      {/* Desktop background with blur effect */}
      <div className="hidden lg:block fixed inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-100">
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* Mobile container - centered on desktop */}
      <div className="lg:flex lg:items-center lg:justify-center lg:min-h-screen lg:p-8">
        <motion.div
          className="relative w-full max-w-md mx-auto bg-white lg:rounded-3xl lg:shadow-2xl lg:overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            minHeight: "100vh",
          }}
        >
          {/* Mobile header notch (decorative) */}
          <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-50" />

          {/* Content */}
          <div className="relative">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
