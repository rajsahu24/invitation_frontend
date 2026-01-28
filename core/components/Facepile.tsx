"use client";

import { motion } from "framer-motion";
import { Guest } from "../../lib/store";

interface FacepileProps {
  guests: Guest[];
  maxVisible?: number;
}

export default function Facepile({ guests, maxVisible = 8 }: FacepileProps) {
  const visibleGuests = guests.slice(0, maxVisible);
  const goingGuests = guests.filter((g) => g.status === "going");
  const remainingCount = guests.length - visibleGuests.length;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {goingGuests.length} friends going
        </h3>
        <button className="text-violet-600 text-sm font-medium hover:text-violet-700">
          See all
        </button>
      </div>

      {/* Avatars grid */}
      <div className="flex flex-wrap gap-3">
        {visibleGuests.map((guest, index) => (
          <motion.div
            key={guest.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            {/* Avatar */}
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-lg font-bold shadow-lg overflow-hidden ${
                guest.status === "going"
                  ? "ring-2 ring-green-400 ring-offset-2"
                  : "opacity-60"
              }`}
            >
              {guest.avatar ? (
                <img
                  src={guest.avatar}
                  alt={guest.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                guest.name.charAt(0)
              )}
            </div>

            {/* Mutual friend indicator */}
            {guest.isMutual && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-[10px]">👥</span>
              </div>
            )}

            {/* Status indicator */}
            {guest.status === "going" && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-[10px]">✓</span>
              </div>
            )}

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                {guest.name}
                {guest.isMutual && (
                  <span className="text-blue-300 ml-1">• mutual</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: visibleGuests.length * 0.05 }}
            className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-semibold shadow-lg cursor-pointer hover:bg-gray-200 transition-colors"
          >
            +{remainingCount}
          </motion.div>
        )}
      </div>

      {/* Mutual friends highlight */}
      {guests.some((g) => g.isMutual) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center gap-3">
          <div className="flex -space-x-2">
            {guests
              .filter((g) => g.isMutual)
              .slice(0, 3)
              .map((guest) => (
                <div
                  key={guest.id}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold border-2 border-blue-50"
                >
                  {guest.name.charAt(0)}
                </div>
              ))}
          </div>
          <p className="text-sm text-blue-700">
            You have{" "}
            <span className="font-semibold">
              {guests.filter((g) => g.isMutual).length} mutual friends
            </span>{" "}
            going!
          </p>
        </div>
      )}
    </div>
  );
}
