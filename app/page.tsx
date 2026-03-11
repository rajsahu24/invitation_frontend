
import LandingPageV2 from '@/core/components/landingV2/LandingPageV2';

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
          <div>
            <LandingPageV2 />
            </div>
    </main>
  );
}
