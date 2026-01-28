import Navigation from '@/core/components/landing/Navigation';
import Hero from '@/core/components/landing/Hero';
import Features from '@/core/components/landing/Features';
import Templates from '@/core/components/landing/templates';
import HowItWorks from '@/core/components/landing/HowItWorks';
import Testimonials from '@/core/components/landing/Testimonials';
import CTA from '@/core/components/landing/CTA';
import Footer from '@/core/components/landing/Footer';
import ScrollToTop from '@/core/components/ui/ScrollToTop';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
