"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { MapPin, Clock, Users, ChevronDown } from "lucide-react";
import { SubEvent, RSVPStatus, useEventStore } from "../lib/store";

interface SubEventCardProps {
  subEvent: SubEvent;
  index: number;
}

const rsvpOptions: { value: RSVPStatus; label: string; emoji: string; color: string }[] = [
  { value: "going", label: "Going", emoji: "✅", color: "bg-green-500" },
  { value: "maybe", label: "Maybe", emoji: "🤔", color: "bg-yellow-500" },
  { value: "no", label: "Can't go", emoji: "❌", color: "bg-red-500" },
];

export default function SubEventCard({ subEvent, index }: SubEventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localStatus, setLocalStatus] = useState<RSVPStatus>(null);
  const { rsvpStatus, setRSVP } = useEventStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const currentStatus = localStatus || rsvpStatus[subEvent.id];
  const selectedOption = rsvpOptions.find((opt) => opt.value === currentStatus);

  const handleRSVP = (status: RSVPStatus) => {
    setLocalStatus(status);
    setRSVP(subEvent.id, status);

    // Trigger confetti if going
    if (status === "going" && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#a855f7", "#f472b6", "#22d3ee", "#facc15"],
        disableForReducedMotion: true,
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      layout
    >
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute -top-6 left-8 w-0.5 h-6 bg-gradient-to-b from-violet-200 to-violet-400" />
      )}

      {/* Card Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          {/* Timeline dot */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xl shadow-lg">
              {index === 0 ? "🪔" : index === 1 ? "💅" : index === 2 ? "💃" : "💒"}
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-violet-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{subEvent.title}</h3>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {subEvent.time.split(" - ")[0]}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {subEvent.location.split(",")[0]}
              </span>
            </div>
          </div>

          {/* Status badge */}
          {currentStatus && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${rsvpOptions.find(o => o.value === currentStatus)?.color} text-white`}>
              {rsvpOptions.find(o => o.value === currentStatus)?.emoji} {rsvpOptions.find(o => o.value === currentStatus)?.label}
            </div>
          )}

          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              <p className="text-gray-600 mb-4">{subEvent.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{subEvent.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{subEvent.location}</span>
                </div>
                {subEvent.capacity && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {subEvent.capacity}</span>
                  </div>
                )}
              </div>

              {/* RSVP Buttons */}
              <div className="flex gap-2">
                {rsvpOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRSVP(option.value);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      currentStatus === option.value
                        ? `${option.color} text-white shadow-lg`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {option.emoji} {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
