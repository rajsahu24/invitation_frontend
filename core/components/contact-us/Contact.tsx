'use client';

import { Mail, MessageCircle, Phone, Send, User } from 'lucide-react';
import { useState } from 'react';

const WHATSAPP_NUMBER = '+91 8239688824';
const EMAIL = 'hello@inviteera.com';

const inputBase: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--color-bg-primary)',
  border: '1.5px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '12px 16px',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--color-text-heading)',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelBase: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-text-body)',
  marginBottom: '6px',
};

const focusGreen = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.target.style.borderColor = 'var(--color-accent-primary)');
const blurReset = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.target.style.borderColor = 'var(--color-border)');

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    eventType: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: Number(form.phone.replace(/\D/g, '')),
          message: form.message,
          subject: form.subject,
          event_type: form.eventType,
        }),
      });
      if (!res.ok) throw new Error('Something went wrong. Please try again.');
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    {
      href: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`,
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'WhatsApp',
      value: WHATSAPP_NUMBER,
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.07)',
      border: 'rgba(34,197,94,0.2)',
      target: '_blank',
    },
    {
      href: `mailto:${EMAIL}`,
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: EMAIL,
      color: 'var(--color-accent-primary)',
      bg: 'rgba(74,124,89,0.07)',
      border: 'rgba(74,124,89,0.2)',
      target: undefined,
    },
    {
      href: `tel:${WHATSAPP_NUMBER}`,
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      value: WHATSAPP_NUMBER,
      color: 'var(--color-accent-coral)',
      bg: 'rgba(224,123,90,0.07)',
      border: 'rgba(224,123,90,0.2)',
      target: undefined,
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container-landing">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 mb-5 text-[11px] uppercase tracking-[0.14em]"
            style={{
              backgroundColor: 'rgba(74,124,89,0.08)',
              color: 'var(--color-accent-primary)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              border: '1px solid rgba(74,124,89,0.2)',
            }}
          >
            <span style={{ fontSize: '8px' }}>✦</span>
            We&apos;d love to hear from you
          </div>
          <h1
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              letterSpacing: '-0.01em',
            }}
          >
            Get in{' '}
            <span style={{ color: 'var(--color-accent-primary)', fontStyle: 'italic', fontWeight: 400 }}>
              Touch
            </span>
          </h1>
          <p
            className="max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-text-body)', lineHeight: 1.7 }}
          >
            Have a question or need help? Reach out and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* ── Contact Info ── */}
          <div className="space-y-4">
            <h2
              className="mb-6"
              style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--color-text-heading)' }}
            >
              Contact Details
            </h2>

            {contactItems.map(({ href, icon, label, value, color, bg, border, target }) => (
              <a
                key={label}
                href={href}
                target={target}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: bg, border: `1.5px solid ${border}`, textDecoration: 'none' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: bg, color, border: `1.5px solid ${border}` }}
                >
                  {icon}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-heading)' }}>
                    {value}
                  </p>
                </div>
              </a>
            ))}

            {/* Response time note */}
            <div
              className="mt-6 p-4 rounded-2xl"
              style={{ backgroundColor: 'rgba(74,124,89,0.06)', border: '1px solid rgba(74,124,89,0.15)' }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
                🕐 <strong>Response time:</strong> We typically reply within 24 hours on business days.
              </p>
            </div>
          </div>

          {/* ── Contact Form ── */}
          <div
            className="lg:col-span-2 rounded-2xl p-8"
            style={{ backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'rgba(74,124,89,0.1)' }}
                >
                  <Send className="w-7 h-7" style={{ color: 'var(--color-accent-primary)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '8px' }}>
                  Message Sent!
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-body)' }}>
                  We&apos;ll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', subject: '', eventType: '', message: '' });
                  }}
                  className="mt-6 text-sm underline"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent-primary)' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="mb-2">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '4px' }}>
                    Send a Message
                  </h2>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    Fill in the details below and we&apos;ll respond within 24 hours.
                  </p>
                </div>

                {/* Row 1 — Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelBase}>Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
                      <input
                        type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="John Doe"
                        style={{ ...inputBase, paddingLeft: '40px' }}
                        onFocus={focusGreen} onBlur={blurReset}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelBase}>Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
                      <input
                        type="email" name="email" required value={form.email} onChange={handleChange}
                        placeholder="you@example.com"
                        style={{ ...inputBase, paddingLeft: '40px' }}
                        onFocus={focusGreen} onBlur={blurReset}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2 — Phone + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelBase}>Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+91 00000 00000"
                        style={{ ...inputBase, paddingLeft: '40px' }}
                        onFocus={focusGreen} onBlur={blurReset}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelBase}>Subject *</label>
                    <select
                      name="subject" required value={form.subject} onChange={handleChange}
                      style={{ ...inputBase, cursor: 'pointer' }}
                      onFocus={focusGreen} onBlur={blurReset}
                    >
                      <option value="" disabled>Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Row 3 — Event Type */}
                <div>
                  <label style={labelBase}>Event Type</label>
                  <select
                    name="eventType" value={form.eventType} onChange={handleChange}
                    style={{ ...inputBase, cursor: 'pointer' }}
                    onFocus={focusGreen} onBlur={blurReset}
                  >
                    <option value="" disabled>What event are you planning?</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="babyshower">Baby Shower</option>
                    <option value="engagement">Engagement</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Row 4 — Message */}
                <div>
                  <label style={labelBase}>Message *</label>
                  <textarea
                    name="message" required rows={5} value={form.message} onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    style={{ ...inputBase, resize: 'none' }}
                    onFocus={focusGreen} onBlur={blurReset}
                  />
                </div>

                {error && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#dc2626' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[50px] transition-all duration-200"
                  style={{
                    backgroundColor: loading ? 'var(--color-accent-secondary)' : 'var(--color-accent-primary)',
                    color: 'var(--color-text-white)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    boxShadow: '0 4px 16px rgba(74,124,89,0.35)',
                    letterSpacing: '0.01em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a6347';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(74,124,89,0.45)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!loading) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-accent-primary)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(74,124,89,0.35)';
                    }
                  }}
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
