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

  return <TemplateGallery template_data={template_data} />;
}

export default page