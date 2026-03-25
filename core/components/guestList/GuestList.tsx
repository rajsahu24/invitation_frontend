'use client';

import { useState } from 'react';
import { Users, Search, MessageCircle, ArrowLeft, Mail, Phone, UserCheck, UserX, Clock, HelpCircle, Eye } from 'lucide-react';
import Link from 'next/link';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: number;
  rsvp_token: string;
}

interface GuestListPageProps {
  guests: Guest[];
  invitationId: string;
  invitationTitle?: string;
}

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  0: { label: 'Not Responded', color: '#9A9A9A', bg: 'rgba(154,154,154,0.1)', icon: <Clock className="w-3 h-3" /> },
  1: { label: 'Viewed',        color: '#F5C518', bg: 'rgba(245,197,24,0.1)',  icon: <Eye className="w-3 h-3" /> },
  2: { label: 'Confirmed',     color: '#4A7C59', bg: 'rgba(74,124,89,0.1)',   icon: <UserCheck className="w-3 h-3" /> },
  3: { label: 'Maybe',         color: '#7BAE7F', bg: 'rgba(123,174,127,0.1)', icon: <HelpCircle className="w-3 h-3" /> },
  4: { label: 'Declined',      color: '#E07B5A', bg: 'rgba(224,123,90,0.1)',  icon: <UserX className="w-3 h-3" /> },
};

const FILTERS = ['All', 'Confirmed', 'Viewed', 'Maybe', 'Declined', 'Not Responded'] as const;
type Filter = typeof FILTERS[number];

const filterToStatus: Record<Filter, number | null> = {
  All: null, Confirmed: 2, Viewed: 1, Maybe: 3, Declined: 4, 'Not Responded': 0,
};

export default function GuestListPage({ guests, invitationId, invitationTitle }: GuestListPageProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search);
    const matchFilter = filterToStatus[filter] === null || g.status === filterToStatus[filter];
    return matchSearch && matchFilter;
  });

  const counts = {
    total: guests.length,
    confirmed: guests.filter((g) => g.status === 2).length,
    pending: guests.filter((g) => g.status === 0).length,
    declined: guests.filter((g) => g.status === 4).length,
  };

  const handleWhatsApp = (guest: Guest) => {
    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${guest.rsvp_token}`;
    const msg = `Hi ${guest.name}! 🎉\n\nYou're invited to ${invitationTitle || 'our event'}!\n\nView your invitation: ${url}`;
    window.open(`https://wa.me/${guest.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container-landing">

        {/* Back + Header */}
        <div className="mb-8">
          <Link
            href={`/host`}
            className="inline-flex items-center gap-2 mb-6 text-sm transition-colors hover:opacity-70"
            style={{ color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3 text-[11px] uppercase tracking-[0.14em]"
                style={{ backgroundColor: 'rgba(74,124,89,0.08)', color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)', fontWeight: 600, border: '1px solid rgba(74,124,89,0.2)' }}
              >
                <span style={{ fontSize: '8px' }}>✦</span>
                {invitationTitle || 'Invitation'}
              </div>
              <h1
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, color: 'var(--color-text-heading)' }}
              >
                Guest{' '}
                <span style={{ color: 'var(--color-accent-primary)', fontStyle: 'italic', fontWeight: 400 }}>List</span>
              </h1>
            </div>

            <div
              className="flex items-center gap-2 px-4 py-2 rounded-2xl"
              style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <Users className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                {counts.total} Guests
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',     value: counts.total,     color: 'var(--color-accent-primary)', bg: 'rgba(74,124,89,0.08)',   border: 'rgba(74,124,89,0.2)' },
            { label: 'Confirmed', value: counts.confirmed,  color: '#4A7C59',                    bg: 'rgba(74,124,89,0.08)',   border: 'rgba(74,124,89,0.2)' },
            { label: 'Pending',   value: counts.pending,    color: '#9A9A9A',                    bg: 'rgba(154,154,154,0.08)', border: 'rgba(154,154,154,0.2)' },
            { label: 'Declined',  value: counts.declined,   color: '#E07B5A',                    bg: 'rgba(224,123,90,0.08)', border: 'rgba(224,123,90,0.2)' },
          ].map(({ label, value, color, bg, border }) => (
            <div
              key={label}
              className="rounded-2xl p-4 text-center"
              style={{ backgroundColor: bg, border: `1.5px solid ${border}` }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color }}>{value}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
        >
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                border: '1.5px solid var(--color-border)',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-heading)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  backgroundColor: filter === f ? 'var(--color-accent-primary)' : 'var(--color-bg-primary)',
                  color: filter === f ? 'var(--color-text-white)' : 'var(--color-text-body)',
                  fontFamily: 'var(--font-body)',
                  border: `1.5px solid ${filter === f ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                }}
              >
                {f}
                <span className="ml-1.5 opacity-70">
                  {f === 'All' ? guests.length : guests.filter((g) => g.status === filterToStatus[f]).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Guest Cards */}
        {filtered.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
          >
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-text-heading)', marginBottom: '6px' }}>No guests found</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-muted)' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((guest) => {
              const status = STATUS_CONFIG[guest.status] ?? STATUS_CONFIG[0];
              return (
                <div
                  key={guest.id}
                  className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
                >
                  {/* Avatar + Name row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg"
                      style={{ backgroundColor: 'rgba(74,124,89,0.1)', color: 'var(--color-accent-primary)', fontFamily: 'var(--font-display)' }}
                    >
                      {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-text-heading)' }}>
                        {guest.name}
                      </p>
                      {/* Status badge */}
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium mt-0.5"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-2 mb-4">
                    {guest.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                        <span className="text-xs truncate" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-body)' }}>{guest.email}</span>
                      </div>
                    )}
                    {guest.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                        <span className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-body)' }}>{guest.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp button */}
                  {guest.phone && (
                    <button
                      onClick={() => handleWhatsApp(guest)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-80"
                      style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1.5px solid rgba(34,197,94,0.25)', fontFamily: 'var(--font-body)' }}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Send Invitation via WhatsApp
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
