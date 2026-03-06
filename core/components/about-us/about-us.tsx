import React from 'react'
import { Heart, Sparkles, Target, Eye } from 'lucide-react'

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-7">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">InviteEra</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Making wedding invitations smarter, easier, and more interactive.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-violet-600" />
            <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed">
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
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">What is InviteEra?</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            InviteEra is a digital invitation platform designed to help couples create elegant online wedding invitations that are easy to share and manage.
          </p>
          <div className="space-y-3">
            <p className="text-slate-900 font-semibold mb-4">With InviteEra, couples can:</p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">✓</span>
                <span>Create stunning digital wedding invitations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">✓</span>
                <span>Share invitations instantly with guests</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">✓</span>
                <span>Manage RSVP responses easily</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">✓</span>
                <span>Update event details in real time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">✓</span>
                <span>Provide guests with useful information like event schedules, maps, and travel details</span>
              </li>
            </ul>
          </div>
          <p className="text-slate-600 leading-relaxed mt-6">
            Our goal is to make the invitation process simple, modern, and stress-free.
          </p>
        </div>
      </section>

      {/* Why We Built InviteEra */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Why We Built InviteEra</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Planning a wedding involves hundreds of small details, and invitations are one of the most important parts of it.
          </p>
          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <p className="text-slate-900 font-semibold mb-4">Traditional invitations can be:</p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <span>Expensive</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <span>Time-consuming</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <span>Difficult to update once printed</span>
              </li>
            </ul>
          </div>
          <p className="text-slate-600 leading-relaxed">
            InviteEra solves these problems by giving couples a digital-first invitation experience that saves time, reduces costs, and allows flexibility.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Our mission is to modernize wedding invitations by providing a platform that combines design, technology, and convenience.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              We want every couple to have a beautiful invitation experience without the hassle of traditional processes.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We believe the future of invitations is digital.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              InviteEra aims to become a platform where people can create memorable, shareable, and interactive invitations for life's most important celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* Built with Passion */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-violet-600" />
            <h2 className="text-3xl font-bold text-slate-900">Built with Passion</h2>
          </div>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
            InviteEra is a passion project built with modern web technologies and a focus on performance, user experience, and elegant design.
          </p>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mt-4">
            We are constantly improving the platform to deliver the best digital invitation experience.
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutUs