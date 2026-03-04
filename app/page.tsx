import Navigation from '@/core/components/landing/Navigation';
import Hero from '@/core/components/landing/Hero';
import Features from '@/core/components/landing/Features';
import Templates from '@/core/components/landing/templates';
import HowItWorks from '@/core/components/landing/HowItWorks';
import Testimonials from '@/core/components/landing/Testimonials';
import CTA from '@/core/components/landing/CTA';
import Footer from '@/core/components/landing/Footer';
import ScrollToTop from '@/core/components/ui/ScrollToTop';
import FAQSection from '@/core/components/landing/FAQSection';
import { Template } from '@/core/dataModels/templateFieldDataModel';

export default async function  LandingPage() {
  let template_data = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`);
    if (!response.ok) throw new Error('Failed to fetch templates');
    template_data = await response.json();
  } catch (error) {
    console.error('Error fetching templates:', error);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <Hero />
      <Templates template_data={template_data} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <FAQSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
