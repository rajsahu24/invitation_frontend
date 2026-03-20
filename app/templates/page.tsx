
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
    const allTemplates = await response.json();
    // Filter to only show active templates on server side
    template_data = allTemplates.filter((t: any) => t.is_active === true || t.is_active === undefined);
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