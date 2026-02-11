import HostDashboardContent from '@/core/components/HostDashboardContent'


import { cookies } from 'next/headers'
import {Invitation} from '../../../core/dataModels/templateFieldDataModel'

interface PageProps {
  params: Promise<{
    invitationId: string
  }>
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: number;
  rsvp_token:string
}


async function page({ params }: PageProps) {
  const { invitationId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  let guests: Guest[] = [];
  let templateSection: any
  let invitation: any

  
  // Fetch guests
  try {
    const guestsResponse = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/guest/${invitationId}`, {
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (guestsResponse.ok) {
      guests = await guestsResponse.json();
    } else {
      console.error('Failed to fetch guests:', guestsResponse.status);
    }
  } catch (error) {
    console.error('Failed to fetch guests:', error);
  }

  // Fetch invitation details
  try {
    const invitationResponse = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/${invitationId}`, {
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (invitationResponse.ok) {
      invitation = await invitationResponse.json();
    }
  } catch (error) {
    console.error('Failed to fetch invitation details:', error);
  }

  // Fetch template
  try {
    const templateResponse = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/template-sections/invitation/${invitationId}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (templateResponse.ok) {
      const contentType = templateResponse.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        templateSection = await templateResponse.json();
      }
    }
  } catch (error) {
    // Silently fail - template is optional
  }

  console.log(templateSection)
  
  return <HostDashboardContent guests={guests} templateSection={templateSection} invitation={invitation} invitationId={invitationId}/>;
}

export default page