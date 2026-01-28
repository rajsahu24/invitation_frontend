"use client";

import { motion } from "framer-motion";

interface Guest {
  id: string;
  name: string;
  avatar?: string;
  status: "going" | "maybe" | "pending";
}

interface GuestListProps {
  guests: Guest[];
  totalGuests?: number;
  maxVisible?: number;
}

const statusConfig = {
  going: { emoji: "✅", label: "Going", color: "bg-green-100 text-green-700" },
  maybe: { emoji: "🤔", label: "Maybe", color: "bg-yellow-100 text-yellow-700" },
  pending: { emoji: "⏳", label: "Pending", color: "bg-gray-100 text-gray-700" },
};

export default function GuestList({
  guests,
  totalGuests,
  maxVisible = 8,
}: GuestListProps) {
  const visibleGuests = guests.slice(0, maxVisible);
  const remainingCount = (totalGuests || guests.length) - visibleGuests.length;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent mb-4">
            Who's Coming?
          </h2>
          <p className="text-gray-600 text-lg">
            Join {totalGuests || guests.length} friends at this event!
          </p>
        </motion.div>

        {/* Guest avatars grid */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {visibleGuests.map((guest, index) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all cursor-pointer overflow-hidden">
                {guest.avatar ? (
                  <img
                    src={guest.avatar}
                    alt={guest.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  guest.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 text-sm">
                {statusConfig[guest.status].emoji}
              </div>
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded-full whitespace-nowrap">
                  {guest.name}
                </div>
              </div>
            </motion.div>
          ))}

          {remainingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: visibleGuests.length * 0.1 }}
              className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-semibold shadow-lg cursor-pointer hover:bg-gray-200 transition-colors"
            >
              +{remainingCount}
            </motion.div>
          )}
        </div>

        {/* Guest list with details */}
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 md:p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Guest List
          </h3>
          <div className="space-y-3">
            {visibleGuests.map((guest, index) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {guest.avatar ? (
                      <img
                        src={guest.avatar}
                        alt={guest.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      guest.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="font-medium text-gray-800">{guest.name}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusConfig[guest.status].color
                  }`}
                >
                  {statusConfig[guest.status].label}
                </span>
              </motion.div>
            ))}
          </div>

          {remainingCount > 0 && (
            <button className="w-full mt-6 py-3 text-violet-600 font-semibold hover:text-violet-700 transition-colors">
              View all {totalGuests || guests.length} guests →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
