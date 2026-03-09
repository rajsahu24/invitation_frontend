'use client';

import Navigation from './Navigation';
import Hero from './Hero';
import SocialProofBar from './SocialProofBar';
import TemplateSlider from './TemplateSlider';
import Features from './Features';
import WhyChooseWebsite from './WhyChooseWebsite';
import ModernTouch from './ModernTouch';
import BlogSection from './BlogSection';
import Testimonials from './Testimonials';
import CTA from './CTA';
import Footer from './Footer';

export default function LandingPageV2() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <Navigation />
      <Hero />
      <SocialProofBar />
      <TemplateSlider />
      <Features />
      <WhyChooseWebsite />
      <ModernTouch />
      <BlogSection />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
