
import Footer from '@/core/components/landingV2/Footer'
import Navigation from '@/core/components/landingV2/Navigation'
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Inviteera Blogs',
  description: 'Explore wedding planning tips, digital invitation ideas, RSVP management guides, and modern wedding trends on the InviteEra blog.',
}
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
      <Navigation  />
  {children}
  <Footer/>
  </>
}