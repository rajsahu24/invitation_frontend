import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

interface Props {
  params: Promise<{
    public_id: string;
  }>;
}

async function getInvitationData(public_id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_APIGATEWAY_URL;
  const fetchUrl = `${apiUrl}/api/invitation-data/public_id/${public_id}`;
  console.log(`[OG Debug] Fetching invitation data from: ${fetchUrl}`);
  
  try {
    const res = await fetch(fetchUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) {
        console.error(`[OG Debug] Fetch failed with status: ${res.status}`);
        return null;
    }
    return res.json();
  } catch (error) {
    console.error('[OG Debug] Error fetching invitation:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { public_id } = await params;
  const headerList = await headers();
  const host = headerList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';

  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || `${protocol}://${host}`;
  console.log(`[OG Debug] Base URL for metadata: ${baseUrl}`);
  
  const data = await getInvitationData(public_id);

  if (!data) {
    return {
      title: 'InviteEra - Digital Invitations',
      description: 'Create and share beautiful digital invitations.',
      openGraph: {
        images: [`${baseUrl}/api/og/invitation?public_id=default`],
      }
    };
  }

  const title = data.invitation_title || 'You are Invited!';
  const description = data.invitation_message || data.invitation_tag_line || 'Join us for a special celebration.';
  // Use the one defined at line 37
  // baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://inviteera.com';
  
  // Dynamic OG Image URL
  const ogImageUrl = `${baseUrl}/api/og/invitation?public_id=${public_id}`;

  return {
    title: `${title} | InviteEra`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/public/${public_id}`,
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

export default async function PublicInvitationPage({ params }: Props) {
  const { public_id } = await params;
  const templateBaseUrl = process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL || 'http://localhost:5173';
  
  // We use the same public ID to render the template via the rewritten route or direct proxy
  const invitationUrl = `${templateBaseUrl}/public/${public_id}`;

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
