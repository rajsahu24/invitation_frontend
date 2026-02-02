'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  category: string;
}

function templates() {
    const { scrollY } = useScroll();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    
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
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`);
        const data = await response.json();
        setTemplates(data.slice(0, 4)); // Show only first 2 templates
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);
  console.log(templates)
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-12">
               {templates.map((template) => (
                  <div key={template.id} className="flex flex-col items-center group">
                    <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] p-1 shadow-2xl border-4 border-gray-800 transition-transform duration-500 group-hover:scale-105">
                       {/* Phone Notch */}
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-9 bg-gray-900 rounded-b-xl z-20"></div>
                       {/* Screen */}
                       <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
                          <iframe 
                            src={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`}
                            className="w-full h-full border-0"
                            title={template.name}
                            loading="lazy"
                          />
                       </div>
                    </div>
                    <Link href={`${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/${template.id}`} target="_blank">
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         className="mt-8 px-8 py-3 bg-violet-600 text-white rounded-xl font-bold shadow-lg hover:bg-violet-700 transition-colors"
                       >
                         {template.name}
                       </motion.button>
                    </Link>
                  </div>
               ))}
            </div>
          )}
        </div>
      </div>
  )
}

export default templates