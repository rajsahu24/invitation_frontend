"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Users, Sparkles, ArrowRight, Settings } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 animate-gradient">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-6xl mb-6"
          >
            🎉
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The New Way to
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Invite & Celebrate
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-lg mx-auto">
            Create stunning, interactive invitations for your mega-events. 
            From weddings to birthday bashes, make every moment unforgettable.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/host">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-violet-600 rounded-2xl font-bold text-lg shadow-xl flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Host Dashboard
              </motion.button>
            </Link>
            <Link href="/malhotra-wedding">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-violet-600 rounded-2xl font-bold text-lg shadow-xl flex items-center gap-2"
              >
                View Demo Event
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Everything you need for
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              {" "}perfect events
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📅",
                title: "Itinerary Timeline",
                desc: "Multiple sub-events with RSVP toggles per event",
              },
              {
                icon: "👥",
                title: "Social Proof",
                desc: "Facepile with mutual friends highlights",
              },
              {
                icon: "💬",
                title: "Activity Feed",
                desc: "Comments with emoji reactions",
              },
              {
                icon: "📸",
                title: "Photo Roll",
                desc: "Grid gallery with lightbox viewer",
              },
              {
                icon: "🎊",
                title: "Confetti Effects",
                desc: "Celebration animations on RSVP",
              },
              {
                icon: "📱",
                title: "Mobile First",
                desc: "Centered 500px view for app-like experience",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Template Showcase Section */}
      <div className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-12 text-gray-900"
          >
            Choose Your <span className="text-violet-600">Perfect Style</span>
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-12">
             {[1, 2].map((id) => (
                <div key={id} className="flex flex-col items-center group">
                  <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 transition-transform duration-500 group-hover:scale-105">
                     {/* Phone Notch */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20"></div>
                     {/* Screen */}
                     <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
                        <iframe 
                          src={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/wedding/${id}`}
                          className="w-full h-full border-0"
                          title={`Template ${id}`}
                          loading="lazy"
                        />
                     </div>
                  </div>
                  <Link href={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/wedding/${id}`} target="_blank">
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="mt-8 px-8 py-3 bg-violet-600 text-white rounded-xl font-bold shadow-lg hover:bg-violet-700 transition-colors"
                     >
                       Select Template {id}
                     </motion.button>
                  </Link>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-white/60">
        <p>Built with Next.js 16, Tailwind CSS 4, and Framer Motion</p>
      </footer>
    </div>
  );
}
