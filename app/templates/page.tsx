
import Footer from '@/core/components/landingV2/Footer';
import Navigation from '@/core/components/landingV2/Navigation';
import TemplateGallery from '@/core/components/template/template';

export const dynamic = 'force-dynamic';

async function page() {
  let template_data = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch templates');
    template_data = await response.json();
  } catch (error) {
    console.error('Error fetching templates:', error);
  }

  return <>
  <Navigation />
  <TemplateGallery template_data={template_data} />
  <Footer/>
  </>
}

export default page