import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const internalRoutes = ['login', 'register', 'host', 'api', 'templates', 'about-us', 'faq', 'blog', 'auth', 'home-2', 'public'];

function isPublicId(slug: string) {
  return slug.startsWith('pub_') && slug.length === 16;
}

async function getInvitationBySlug(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_APIGATEWAY_URL;
  const fetchUrl = `${apiUrl}/api/invitation-data/slug/${slug}`;
  try {
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getInvitationByPublicId(public_id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_APIGATEWAY_URL;
  const fetchUrl = `${apiUrl}/api/invitation-data/public_id/${public_id}`;
  try {
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const headerList = await headers();
  const host = headerList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || `${protocol}://${host}`;

  if (internalRoutes.includes(slug)) return {};

  const data = isPublicId(slug)
    ? await getInvitationByPublicId(slug)
    : await getInvitationBySlug(slug);

  if (!data) {
    return {
      title: 'InviteEra - Digital Invitations',
      description: 'Create and share beautiful digital invitations.',
      openGraph: { images: [`${baseUrl}/api/og/invitation?slug=default`] },
    };
  }

  const title = data.invitation_title || 'You are Invited!';
  const description = data.invitation_message || data.invitation_tag_line || 'Join us for a special celebration.';
  const ogImageUrl = isPublicId(slug)
    ? `${baseUrl}/api/og/invitation?public_id=${slug}`
    : `${baseUrl}/api/og/invitation?slug=${slug}`;

  return {
    title: `${title} | InviteEra`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${slug}`,
      siteName: 'InviteEra',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SlugInvitationPage({ params }: Props) {
  const { slug } = await params;

  if (internalRoutes.includes(slug)) notFound();

  const data = isPublicId(slug)
    ? await getInvitationByPublicId(slug)
    : await getInvitationBySlug(slug);

  if (!data) notFound();

  const templateBaseUrl = process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL || 'http://localhost:2000';
  const invitationUrl = isPublicId(slug)
    ? `${templateBaseUrl}/public/${slug}`
    : `${templateBaseUrl}/${slug}`;

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src={invitationUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Digital Invitation"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
