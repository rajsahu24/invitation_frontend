import FAQSection from '@/core/components/landing/FAQSection'
import Footer from '@/core/components/landingV2/Footer'
import Navigation from '@/core/components/landingV2/Navigation'
import React from 'react'

function page() {
  return (
    <div>
        <Navigation/>
        <FAQSection />
        <Footer/>
    </div>
  )
}

export default page