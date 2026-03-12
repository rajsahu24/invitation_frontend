import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Function to fetch invitation data by slug
async function getInvitationBySlug(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_APIGATEWAY_URL;
  try {
    const res = await fetch(`${apiUrl}/api/invitation-data/slug/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching invitation by slug:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // We don't want to show metadata for internal routes if they match the slug
  // though Next.js usually prioritizes static routes over dynamic ones anyway.
  const internalRoutes = ['login', 'register', 'host', 'api', 'templates', 'about-us', 'faq', 'blog'];
  if (internalRoutes.includes(slug)) {
    return {};
  }

  const data = await getInvitationBySlug(slug);

  if (!data) {
    return {
      title: 'Invitation Not Found - InviteEra',
    };
  }

  const title = data.invitation_title || 'You are Invited!';
  const description = data.invitation_message || data.invitation_tag_line || 'Join us for a special celebration.';
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://inviteera.com';
  
  // Dynamic OG Image URL using slug
  const ogImageUrl = `${baseUrl}/api/og/invitation?slug=${slug}`;

  return {
    title: `${title} | InviteEra`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/${slug}`,
      siteName: 'InviteEra',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImageUrl],
    },
  };
}

export default async function SlugInvitationPage({ params }: Props) {
  const { slug } = await params;
  
  // Safety check for internal routes
  const internalRoutes = ['login', 'register', 'host', 'api', 'templates', 'about-us', 'faq', 'blog'];
  if (internalRoutes.includes(slug)) {
    notFound();
  }

  const data = await getInvitationBySlug(slug);
  if (!data) {
    notFound();
  }

  const templateBaseUrl = process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL || 'http://localhost:5173';
  
  // Embed the actual invitation content from the Vite app
  const invitationUrl = `${templateBaseUrl}/${slug}`;

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src={invitationUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Digital Invitation"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
