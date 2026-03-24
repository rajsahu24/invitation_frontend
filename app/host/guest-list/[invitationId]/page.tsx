import GuestListPage from '@/core/components/guestList/GuestList';
import Navigation from '@/core/components/landingV2/Navigation';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

interface PageProps {
  params: Promise<{ invitationId: string }>;
}

const baseUrl = 'https://inviteera.com';

async function getInvitation(invitationId: string, token: string | undefined) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/${invitationId}`,
      { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { invitationId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const inv = await getInvitation(invitationId, token);

  const title = inv?.invitation_title
    ? `Guest List — ${inv.invitation_title} | InviteEra`
    : 'Guest List | InviteEra';

  const description = inv?.invitation_title
    ? `Manage and track all guests for "${inv.invitation_title}". View RSVP statuses, send WhatsApp invitations, and monitor responses in one place.`
    : 'Manage and track all your event guests. View RSVP statuses, send WhatsApp invitations, and monitor responses in one place.';

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/host/guest-list/${invitationId}`,
      siteName: 'InviteEra',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: number;
  rsvp_token: string;
}

async function page({ params }: PageProps) {
  const { invitationId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let guests: Guest[] = [];

  try {
    const guestsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/guest/${invitationId}`,
      { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } }
    );
    if (guestsResponse.ok) guests = await guestsResponse.json();
  } catch (error) {
    console.error('Failed to fetch guests:', error);
  }

  const inv = await getInvitation(invitationId, token);
  const invitationTitle: string | undefined = inv?.invitation_title;

  return (
    <>
      <Navigation />
      <GuestListPage guests={guests} invitationId={invitationId} invitationTitle={invitationTitle} />
    </>
  );
}

export default page;
