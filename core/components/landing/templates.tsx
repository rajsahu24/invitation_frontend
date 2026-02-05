'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Sparkles } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
}

function Templates() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`);
        const data = await response.json();
        setTemplates(data.slice(0, 6)); 
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % templates.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };

  // Mobile slider dimensions
  const SLIDE_WIDTH = 75; // vw
  const SLIDE_GAP = 5; // vw
  const SLIDE_OFFSET = (100 - SLIDE_WIDTH) / 2; // vw to center first slide

  return (
    <section id="templates" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-20 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full mb-6 font-semibold text-sm border border-blue-100"
            >
              <Sparkles className="w-4 h-4" />
              <span>Premium Collection</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-6 text-gray-900 tracking-tight"
            >
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfect Style</span>
            </motion.h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Dozens of handcrafted designs for every mood and occasion. 
              Find the one that speaks to your event.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Mobile View: Centered Boutique Slider */}
              <div className="md:hidden relative">
                <div className="overflow-visible py-8">
                  <motion.div 
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -30) nextSlide();
                      if (info.offset.x > 30) prevSlide();
                    }}
                    animate={{ x: `${SLIDE_OFFSET - currentIndex * (SLIDE_WIDTH + SLIDE_GAP)}vw` }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="flex"
                    style={{ gap: `${SLIDE_GAP}vw` }}
                  >
                    {templates.map((template, idx) => (
                      <motion.div 
                        key={template.id} 
                        style={{ minWidth: `${SLIDE_WIDTH}vw` }}
                        animate={{ 
                          scale: currentIndex === idx ? 1 : 0.9,
                          opacity: currentIndex === idx ? 1 : 0.5 
                        }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center"
                      >
                        <div className="relative w-full aspect-[9/18.5] bg-gray-950 rounded-[2.8rem] p-1.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-[5px] border-gray-900 ring-1 ring-white/10">
                           {/* Dynamic Notch */}
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-28 bg-gray-900 rounded-b-2xl z-20 flex justify-center items-start pt-1 shadow-inner">
                              <div className="w-10 h-1 bg-gray-800 rounded-full" />
                           </div>
                           
                           <div className="w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden relative">
                              <iframe 
                                src={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`}
                                className="w-full h-full border-0 pointer-events-none"
                                title={template.name}
                              />
                           </div>
                           
                           {/* Decorative Elements */}
                           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-800 rounded-full opacity-50" />
                        </div>
                        
                        <div className="mt-10 text-center">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h3>
                          <Link href={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`} target="_blank" className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-full">
                             View Demo <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2.5 mt-6">
                  {templates.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 transition-all duration-300 rounded-full ${
                        currentIndex === idx ? 'w-10 bg-blue-600 shadow-md shadow-blue-200' : 'w-2 bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop View: Premium Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 px-8">
                 {templates.map((template) => (
                    <motion.div 
                      key={template.id} 
                      className="flex flex-col items-center group"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <div className="relative w-full max-w-[340px] aspect-[9/18.5] bg-gray-950 rounded-[3.2rem] p-2.5 shadow-2xl border-[10px] border-gray-900 transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-blue-200/40">
                         {/* Dynamic Notch */}
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-36 bg-gray-900 rounded-b-3xl z-20 flex justify-center items-start pt-1.5 shadow-inner">
                            <div className="w-12 h-1 bg-gray-800 rounded-full" />
                         </div>
                         
                         <div className="w-full h-full bg-slate-50 rounded-[2.4rem] overflow-hidden relative">
                            <iframe 
                              src={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`}
                              className="w-full h-full border-0 pointer-events-none"
                              title={template.name}
                              loading="lazy"
                            />
                            {/* Premium Hover Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                         </div>
                      </div>
                      
                      <div className="mt-12 text-center">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">{template.category || 'Invitation'}</span>
                        <h3 className="text-3xl font-black text-gray-900 mb-6">{template.name}</h3>
                        <Link href={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`} target="_blank">
                           <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             className="px-10 py-3.5 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:bg-blue-600 transition-all duration-300"
                           >
                             Preview Full Design
                           </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                 ))}
              </div>
            </>
          )}
        </div>
      </section>
  )
}

export default Templates