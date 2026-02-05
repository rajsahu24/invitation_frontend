'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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
        setTemplates(data.slice(0, data.length)); 
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const getIsDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
  const getMaxIndex = () => {
    const isDesktop = getIsDesktop();
    if (isDesktop) {
      return Math.max(0, templates.length - DESKTOP_ITEMS_PER_VIEW);
    }
    return Math.max(0, templates.length - 1);
  };
  const setClampedIndex = (idx: number) => {
    const max = getMaxIndex();
    const clamped = Math.max(0, Math.min(idx, max));
    setCurrentIndex(clamped);
  };
  const nextSlide = () => {
    setClampedIndex(currentIndex + 1);
  };
  const prevSlide = () => {
    setClampedIndex(currentIndex - 1);
  };
  useEffect(() => {
    const onResize = () => setClampedIndex(currentIndex);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize);
    }
    onResize();
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onResize);
      }
    };
  }, [templates.length]);

  // Slider scaling and gaps
  const MOBILE_WIDTH = 75; // vw
  const MOBILE_GAP = 5; // vw
  const DESKTOP_ITEMS_PER_VIEW = 3;

  return (
    <section id="templates" className="py-24 bg-white overflow-hidden selection:bg-blue-100">
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
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Dozens of handcrafted designs for every mood and occasion. 
              Find the one that speaks to your event.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="relative group/slider px-4 md:px-12">
              
              {/* Desktop Navigation Arrows */}
              <div className="hidden md:block">
                <button 
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-30 p-4 bg-white rounded-full shadow-2xl border border-gray-100 text-gray-400 hover:text-blue-600 hover:scale-110 transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-30 p-4 bg-white rounded-full shadow-2xl border border-gray-100 text-gray-400 hover:text-blue-600 hover:scale-110 transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              {/* Mobile Slider */}
              <div className="md:hidden overflow-hidden py-10">
                <motion.div 
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragMomentum={false}
                  dragElastic={0.1}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -40) nextSlide();
                    if (info.offset.x > 40) prevSlide();
                  }}
                  animate={{ x: `${(100 - MOBILE_WIDTH)/2 - currentIndex * (MOBILE_WIDTH + MOBILE_GAP)}vw` }}
                  transition={{ type: "spring", stiffness: 160, damping: 22 }}
                  className="flex"
                  style={{ gap: `${MOBILE_GAP}vw` }}
                >
                  {templates.map((template, idx) => (
                    <motion.div 
                      key={`${template.id}-mobile`} 
                      style={{ minWidth: `${MOBILE_WIDTH}vw` }}
                      animate={{ 
                        scale: currentIndex === idx ? 1 : 0.9,
                        opacity: currentIndex === idx ? 1 : 0.5 
                      }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative w-full aspect-[9/18.5] bg-gray-950 rounded-[2.8rem] p-1.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-[5px] border-gray-900 ring-1 ring-white/10">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-28 bg-gray-900 rounded-b-2xl z-20 flex justify-center items-start pt-1">
                            <div className="w-10 h-1 bg-gray-800 rounded-full" />
                         </div>
                         <div className="w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden relative">
                            <iframe 
                              src={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`}
                              className="w-full h-full border-0 pointer-events-none"
                              title={template.name}
                            />
                         </div>
                      </div>
                      <div className="mt-8 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate max-w-full">{template.name}</h3>
                        <Link href={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`} target="_blank" className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-4 py-2 rounded-full">
                           View Demo <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Desktop Slider */}
              <div className="hidden md:block overflow-hidden py-10">
                <motion.div 
                  animate={{ x: `-${currentIndex * (100 / DESKTOP_ITEMS_PER_VIEW)}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="flex w-full"
                >
                  {templates.map((template) => (
                    <div 
                      key={`${template.id}-desktop`} 
                      className="min-w-[33.333%] px-6 flex flex-col items-center group/card"
                    >
                      <div className="relative w-full max-w-[320px] aspect-[9/18.5] bg-gray-950 rounded-[3.2rem] p-2.5 shadow-2xl border-[10px] border-gray-900 transition-all duration-500 group-hover/card:scale-[1.03] group-hover/card:shadow-blue-200/40">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-36 bg-gray-900 rounded-b-3xl z-20 flex justify-center items-start pt-1.5 shadow-inner">
                            <div className="w-12 h-1 bg-gray-800 rounded-full" />
                         </div>
                         <div className="w-full h-full bg-slate-50 rounded-[2.4rem] overflow-hidden relative">
                            <iframe 
                              src={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`}
                              className="w-full h-full border-0 pointer-events-none"
                              title={template.name}
                            />
                         </div>
                      </div>
                      <div className="mt-8 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                        <Link href={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`} target="_blank" className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-4 py-2 rounded-full">
                           View Demo <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Universal Progress Bar */}
              <div className="flex justify-center gap-3 mt-12 mb-8">
                {templates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setClampedIndex(idx)}
                    className={`h-0.5 transition-all duration-300 rounded-full ${
                      currentIndex === idx ? 'w-0.5 bg-blue-600 shadow-lg shadow-blue-200' : 'w-0.5 bg-gray-200 hover:bg-gray-300'
                    }`}
                  />
                ))}
              </div>

            </div>
          )}
        </div>
      </section>
  )
}

export default Templates