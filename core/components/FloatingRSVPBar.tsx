"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Check, Calendar, ArrowUp } from "lucide-react";
import { SubEvent, useEventStore } from "../lib/store";

interface FloatingRSVPBarProps {
  subEvents: SubEvent[];
}

export default function FloatingRSVPBar({ subEvents }: FloatingRSVPBarProps) {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const { rsvpStatus } = useEventStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 300);
  });

  const goingCount = Object.values(rsvpStatus).filter((s) => s === "going").length;
  const totalCount = subEvents.length;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none"
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-700/50 pointer-events-auto">
          <div className="flex items-center justify-between">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">
                  {goingCount} of {totalCount} events
                </p>
                <p className="text-gray-400 text-sm">
                  {goingCount === totalCount
                    ? "You're all set! 🎉"
                    : "Tap to RSVP to all"}
                </p>
              </div>
            </div>

            {/* Action button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-xl font-semibold"
            >
              {goingCount === totalCount ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  Complete
                </>
              ) : (
                <>
                  <ArrowUp className="w-5 h-5" />
                  RSVP All
                </>
              )}
            </motion.button>
          </div>

          {/* Mini progress bar */}
          <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(goingCount / totalCount) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
