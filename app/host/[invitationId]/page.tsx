import HostDashboardContent from '@/core/components/HostDashboardContent'
import React from 'react'

import { cookies } from 'next/headers'

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
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/guest/${invitationId}`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      guests = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch guests:', error);
  }
  
  return <HostDashboardContent guests={guests} />
}

export default page