'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHostStore } from '@/lib/store';
import { ExternalLink, Sparkles, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Template } from '@/core/dataModels/templateFieldDataModel';



const PhoneMockup = ({ template, isVisible }: { template: Template; isVisible: boolean }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewUrl = `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/preview/${template.template_type}/${template.template_name?.replace(/ /g, "_")}/demo`;
  const template_url = template.template_image;
  useEffect(() => {
    if (isIframeLoaded && iframeRef.current?.contentWindow) {
      // Send auto-scroll message once loaded
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({ type: 'AUTO_SCROLL' }, '*');
      }, 1000);
    }
  }, [isIframeLoaded]);

  return (
    <div className="relative w-full max-w-[280px] aspect-[9/19] mx-auto group/phone">
      {/* Premium Outer Frame */}
      <div className="absolute inset-0 bg-[#0F172A] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(59,130,246,0.3)] border-[8px] border-[#1E293B] ring-1 ring-white/10 overflow-hidden transition-all duration-700 group-hover/phone:shadow-blue-500/20 group-hover/phone:border-[#334155] group-hover/phone:scale-[1.05]">
        
        {/* Notch Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-[#1E293B] rounded-b-2xl z-20 flex justify-center items-center gap-1.5 shadow-inner">
          <div className="w-10 h-1 bg-black/40 rounded-full" />
          <div className="w-1.5 h-1.5 bg-[#475569] rounded-full" />
        </div>

        {/* Screen Content Wrapper */}
        <div className="w-full h-full bg-white relative overflow-hidden flex items-center justify-center">
          {/* Static Image Placeholder */}
          <AnimatePresence mode="wait">
            {!isIframeLoaded && (
              <motion.img
                key="placeholder"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={template.template_image}
                className="absolute inset-0 w-full h-full object-cover z-10"
                alt={template.template_name}
              />
            )}
          </AnimatePresence>

          {/* Interactive Iframe */}
          {/* <iframe
            ref={iframeRef}
            src={previewUrl}
            className={`w-full h-full border-0 transition-opacity duration-1000 ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsIframeLoaded(true)}
            title={template.template_name}
            sandbox="allow-scripts allow-same-origin"
          /> */}
          <img src={template_url} alt="" />

          {/* Screen Gloss/Reflection */}
          <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-white/5 via-transparent to-white/10 opacity-50" />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 background-[#1E293B] rounded-full z-20 opacity-30" />
      </div>

      {/* Side Buttons Mockup */}
      <div className="absolute -left-2 top-24 w-1 h-12 bg-[#1E293B] rounded-l-md" />
      <div className="absolute -left-2 top-40 w-1 h-20 bg-[#1E293B] rounded-l-md" />
      <div className="absolute -right-2 top-32 w-1 h-24 bg-[#1E293B] rounded-r-md" />
    </div>
  );
};

interface TemplateDataProps{
  template_data: Template[];
}

function Templates(template_data:TemplateDataProps) {
  const router = useRouter();
  const { user } = useHostStore();

  const constraintsRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-300); // Start offset to have content on both sides
  // Filter to only show active templates
  const templates = template_data.template_data.filter((t: Template) => t.is_active === true || t.is_active === undefined)
  const isDragging = useRef(false);

  // Custom animation loop for infinite scroll marquee
  useAnimationFrame((time, delta) => {
    // Always auto-scroll unless user is actively dragging
    if (isDragging.current || !sliderRef.current) return;
    
    const containerWidth = sliderRef.current.offsetWidth;
    // Calculate movement based on 40s duration for full pass
    const moveAmount = (delta / 1000) * (containerWidth / 40);
    
    const currentPos = x.get();
    const newPos = currentPos - moveAmount;
    
    // Get total width of ONE set of templates (we have 3 sets for seamless loop)
    const totalWidth = sliderRef.current.scrollWidth / 3;
    
    // Seamless infinite loop: when we've scrolled one full set, jump back to start
    if (newPos <= -totalWidth) {
      x.set(newPos + totalWidth);
    } else {
      x.set(newPos);
    }
  });
 

  if (!templates || templates.length === 0) {
    return (
      <section id="templates" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-lg">No templates available at the moment.</p>
        </div>
      </section>
    );
  }

  const handleTemplateClick = async (template: Template) => {
    if (!user) {
      // Store pending invitation and redirect to login
      localStorage.setItem('pending_invitation', JSON.stringify({
        id: template.id,
        template_type: template.template_type,
        template_name: template.template_name
      }));
      router.push('/login');
      return;
    }

    // Direct creation if logged in
    try {
      
      const now = new Date();
      const invitationTitle = now.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) + ' ' + now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
       console.log("formData.......",template)
      const formData = new FormData();
      formData.append('invitation_title', invitationTitle);
      formData.append('invitation_type', template.template_type.toLowerCase());
      formData.append('invitation_template_id', template.id);
      formData.append('metadata', JSON.stringify({}));
     
      const response = await fetch(`/api/invitations`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        router.push(`/host/${data.id}`);
      }
    } catch (error) {
      console.error('Failed to create invitation:', error);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[600px] bg-slate-50">
  //       <div className="relative w-16 h-16">
  //         <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse" />
  //         <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
  //       </div>
  //     </div>
  //   );
  // }

  // Double the templates for seamless infinite loop
  const duplicatedTemplates = [...templates, ...templates, ...templates];

  return (
    <section id="templates" className="py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="w-full">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100/50 text-blue-700 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-blue-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Collection</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight"
            >
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfect Style</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-xl leading-relaxed max-w-2xl mx-auto"
            >
              Handcrafted designs that move with your celebration. 
              Find the one that speaks to your event.
            </motion.p>
        </div>

        {/* Infinite Marquee Slider */}
        <div 
          ref={constraintsRef}
          className="relative flex overflow-hidden group"
          style={{ touchAction: 'none' }}
        >
          <motion.div
            ref={sliderRef}
            drag="x"
            dragConstraints={{ left: -1000, right: 1000 }}
            dragElastic={0.15}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            style={{ x }}
            onDragStart={() => {
              console.log('[TEMPLATE_SLIDER] Drag started');
              isDragging.current = true;
            }}
            onDragEnd={(event, info) => {
              console.log('[TEMPLATE_SLIDER] Drag ended', { 
                offsetX: info.offset.x, 
                velocityX: info.velocity.x 
              });
              // Resume animation immediately after drag ends
              isDragging.current = false;
            }}
            className="flex gap-8 cursor-grab active:cursor-grabbing"
          >
            {duplicatedTemplates.map((template, idx) => (
              <div
                key={`${template.id}-${idx}`}
                className="flex-shrink-0 w-[150px] md:w-[200px] cursor-pointer"
                onClick={() => handleTemplateClick(template)}
                onMouseEnter={() => {
                  console.log('[TEMPLATE_SLIDER] Hover - pausing');
                  isDragging.current = true;
                }}
                onMouseLeave={() => {
                  console.log('[TEMPLATE_SLIDER] Hover end - resuming');
                  isDragging.current = false;
                }}
                onPointerDown={() => {
                  console.log('[TEMPLATE_SLIDER] Touch - pausing');
                  isDragging.current = true;
                }}
                onPointerUp={() => {
                  console.log('[TEMPLATE_SLIDER] Touch end - resuming');
                  isDragging.current = false;
                }}
              >
                <div className="flex flex-col items-center">
                  <PhoneMockup 
                    template={template} 
                    isVisible={true} 
                  />
                  
                  <div className="mt-10 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {template.template_name}
                    </h3>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/preview/${template.template_type}/${template.template_name?.replace(/ /g, "_")}/demo`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs bg-white border border-slate-200 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      View Demo <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          
          {/* Gradient Overlays for Fade Effect - hides white space at edges */}
          {/* <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" /> */}
        </div>
      </div>
    </section>
  );
}

export default Templates;

