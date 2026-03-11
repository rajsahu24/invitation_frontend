import React from 'react'
import { Heart, Sparkles, Target, Eye } from 'lucide-react'

function AboutUs() {
  return (
    <div className="min-h-screen pt-7" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>
            About <span style={{ color: 'var(--color-accent-primary)' }}>InviteEra</span>
          </h1>
          <p className="text-xl leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            Making wedding invitations smarter, easier, and more interactive.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6" style={{ color: 'var(--color-accent-primary)' }} />
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Our Story</h2>
          </div>
          <div className="space-y-4 leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            <p>
              InviteEra was born from a simple idea — making wedding invitations smarter, easier, and more interactive.
            </p>
            <p>
              In today's digital world, traditional invitations often come with challenges: printing delays, distribution issues, and lack of real-time updates. We wanted to create a modern solution where couples can design, share, and manage their wedding invitations digitally while keeping the emotional value of a traditional invite.
            </p>
            <p>
              That's how InviteEra started — as a platform that combines beautiful design with powerful digital features.
            </p>
          </div>
        </div>
      </section>

      {/* What is InviteEra */}
      <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>What is InviteEra?</h2>
          <p className="leading-relaxed mb-6" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            InviteEra is a digital invitation platform designed to help couples create elegant online wedding invitations that are easy to share and manage.
          </p>
          <div className="space-y-3">
            <p className="font-semibold mb-4" style={{ color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>With InviteEra, couples can:</p>
            <ul className="space-y-2" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
              <li className="flex items-start gap-3">
                <span className="mt-1" style={{ color: 'var(--color-accent-primary)' }}>✓</span>
                <span>Create stunning digital wedding invitations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1" style={{ color: 'var(--color-accent-primary)' }}>✓</span>
                <span>Share invitations instantly with guests</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1" style={{ color: 'var(--color-accent-primary)' }}>✓</span>
                <span>Manage RSVP responses easily</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1" style={{ color: 'var(--color-accent-primary)' }}>✓</span>
                <span>Update event details in real time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1" style={{ color: 'var(--color-accent-primary)' }}>✓</span>
                <span>Provide guests with useful information like event schedules, maps, and travel details</span>
              </li>
            </ul>
          </div>
          <p className="leading-relaxed mt-6" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            Our goal is to make the invitation process simple, modern, and stress-free.
          </p>
        </div>
      </section>

      {/* Why We Built InviteEra */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Why We Built InviteEra</h2>
          <p className="leading-relaxed mb-6" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            Planning a wedding involves hundreds of small details, and invitations are one of the most important parts of it.
          </p>
          <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'var(--color-bg-section-alt)' }}>
            <p className="font-semibold mb-4" style={{ color: 'var(--color-text-heading)', fontFamily: 'var(--font-body)' }}>Traditional invitations can be:</p>
            <ul className="space-y-2" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
              <li className="flex items-start gap-3">
                <span className="mt-1" style={{ color: '#E07B5A' }}>✗</span>
                <span>Expensive</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1" style={{ color: '#E07B5A' }}>✗</span>
                <span>Time-consuming</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1" style={{ color: '#E07B5A' }}>✗</span>
                <span>Difficult to update once printed</span>
              </li>
            </ul>
          </div>
          <p className="leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            InviteEra solves these problems by giving couples a digital-first invitation experience that saves time, reduces costs, and allows flexibility.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--color-bg-section-alt)' }}>
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6" style={{ color: 'var(--color-accent-primary)' }} />
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Our Mission</h2>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
              Our mission is to modernize wedding invitations by providing a platform that combines design, technology, and convenience.
            </p>
            <p className="leading-relaxed mt-4" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
              We want every couple to have a beautiful invitation experience without the hassle of traditional processes.
            </p>
          </div>

          <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--color-bg-section-alt)' }}>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6" style={{ color: 'var(--color-accent-primary)' }} />
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Our Vision</h2>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
              We believe the future of invitations is digital.
            </p>
            <p className="leading-relaxed mt-4" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
              InviteEra aims to become a platform where people can create memorable, shareable, and interactive invitations for life's most important celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* Built with Passion */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6" style={{ color: 'var(--color-accent-primary)' }} />
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>Built with Passion</h2>
          </div>
          <p className="leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            InviteEra is a passion project built with modern web technologies and a focus on performance, user experience, and elegant design.
          </p>
          <p className="leading-relaxed max-w-2xl mx-auto mt-4" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            We are constantly improving the platform to deliver the best digital invitation experience.
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutUs