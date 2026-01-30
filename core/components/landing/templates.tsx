'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
function templates() {
    const { scrollY } = useScroll();
    const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(10px)']
  );
  return (
    <div className="py-20 px-6 ">
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
                  <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] p-1 shadow-2xl border-4 border-gray-800 transition-transform duration-500 group-hover:scale-105">
                     {/* Phone Notch */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-9 bg-gray-900 rounded-b-xl z-20"></div>
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
  )
}

export default templates