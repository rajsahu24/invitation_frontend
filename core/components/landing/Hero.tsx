'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Create Beautiful Invitations</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
        >
          Create Beautiful{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Invitations
          </span>
          <br />
          in Minutes
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
        >
          Design stunning event invitations with ease. Perfect for weddings, birthdays, 
          corporate events, and more. No design skills required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/login"
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-gray-200">
            View Examples
          </button>
        </motion.div>

        {/* Phone mockup */}
        <div className='flex justify-center gap-12'>

        {
          [1,2].map((id) => (
            <div key={id}>
        <motion.div
          
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20"
        >

          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative bg-white rounded-3xl shadow-2xl p-2 border-8 border-gray-800">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl pt-2 aspect-[9/16]">
                                   <div className="w-full h-full bg-white  overflow-hidden relative">
                        <iframe 
                          src={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/wedding/${id}`}
                          className="w-full h-full border-0"
                          title={`Template ${id}`}
                          loading="lazy"
                        />
                     </div>
              </div>
            </div>
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl" />
          </div>
        </motion.div>
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
          ))

        }
        </div>
        
      </div>
    </section>
  );
}
