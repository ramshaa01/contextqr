'use client';

import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import ZoneCard from '@/components/ZoneCard';
import { DoorOpen, Armchair, Stethoscope, QrCode, Cpu, Accessibility, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccessibleMotion } from '@/lib/motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

/**
 * Landing page — Zone Simulator
 * Shows 3 clickable zone cards that simulate QR code scanning.
 * This is the entry point of the ContextQR experience.
 */
export default function HomePage() {
  const motionProps = useAccessibleMotion({});

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <main id="main-content" role="main" aria-label="ContextQR Zone Simulator">

        {/* ── Hero Section ── */}
        <section
          aria-labelledby="hero-heading"
          style={{
            background: 'linear-gradient(180deg, rgba(16,185,129,0.06) 0%, transparent 100%)',
            borderBottom: '1px solid var(--border)',
            padding: '80px 0 64px',
          }}
        >
          <div className="container-app" style={{ textAlign: 'center' }}>
            {/* Event badge */}
            <div
              aria-label="FIFA World Cup 2026 Smart Stadiums Challenge"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
            >
              <span className="badge badge-success">
                🏆 FIFA World Cup 2026
              </span>
              <span className="badge badge-info">
                Smart Stadiums Challenge
              </span>
            </div>

            {/* Heading */}
            <h1
              id="hero-heading"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
                color: 'var(--text-primary)',
              }}
            >
              One QR code.
              <br />
              <span className="gradient-text">Infinite context.</span>
            </h1>

            {/* Sub-heading */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'var(--text-muted)',
                maxWidth: '560px',
                margin: '0 auto 40px',
                lineHeight: 1.7,
              }}
            >
              The same QR code gives you a different, personalised response
              depending on where you scan it, when you scan it, and your
              accessibility profile.
            </p>

            {/* Feature pills */}
            <div
              role="list"
              aria-label="Key features"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '48px' }}
            >
              {[
                { icon: QrCode,      label: 'Zone-aware QR' },
                { icon: Cpu,         label: 'Rules engine' },
                { icon: Accessibility, label: 'WCAG AA accessible' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  role="listitem"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    padding: '8px 16px',
                    borderRadius: '99px',
                    fontSize: '0.85rem',
                    color: 'var(--accent)',
                    fontWeight: 600,
                  }}
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>

            {/* Scroll cue */}
            <div
              aria-hidden="true"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}
            >
              <span>Scan a zone to begin</span>
              <ChevronDown size={20} style={{ animation: 'float 2s ease-in-out infinite' }} />
            </div>
          </div>
        </section>

        {/* ── Zone Simulator ── */}
        <section
          aria-labelledby="simulator-heading"
          style={{ padding: '64px 0', flex: 1 }}
        >
          <div className="container-app">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Zone Simulator
              </p>
              <h2
                id="simulator-heading"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}
              >
                Choose a zone to simulate scanning
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '12px', maxWidth: '480px', margin: '12px auto 0' }}>
                Each zone returns a different response — same QR code, different context.
              </p>
            </div>

            {/* Zone cards grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              role="list"
              aria-label="Stadium zones — click to simulate QR scan"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                maxWidth: '960px',
                margin: '0 auto',
              }}
            >
              <motion.div variants={itemVariant} role="listitem">
                <ZoneCard
                  zone="gate"
                  title="Gate Entry"
                  description="Arrive at any stadium gate and scan — get entry guidance, queue info, and accessible route directions tailored to your profile."
                  icon={DoorOpen}
                  accent="#10b981"
                />
              </motion.div>
              <motion.div variants={itemVariant} role="listitem">
                <ZoneCard
                  zone="seat"
                  title="Seating Area"
                  description="Already inside? Scan from your seat — get nearby stalls, crowd density, half-time tips, and real-time assistance options."
                  icon={Armchair}
                  accent="#3b82f6"
                />
              </motion.div>
              <motion.div variants={itemVariant} role="listitem">
                <ZoneCard
                  zone="medical-post"
                  title="Medical Post"
                  description="Scan at any medical post — trigger a symptom triage form, see nearest medic availability, and get immediate guidance."
                  icon={Stethoscope}
                  accent="#f59e0b"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section
          aria-labelledby="how-it-works-heading"
          style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '64px 0',
          }}
        >
          <div className="container-app">
            <h2
              id="how-it-works-heading"
              style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 800, marginBottom: '48px' }}
            >
              How ContextQR works
            </h2>

            <ol
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '32px',
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}
            >
              {[
                {
                  step: '01',
                  title: 'Single QR Code',
                  desc: 'One QR code is placed throughout the stadium. The URL encodes the zone — not the user.',
                },
                {
                  step: '02',
                  title: 'Context Detection',
                  desc: 'The backend detects: which zone, the match phase (pre/half/post), and your optional profile.',
                },
                {
                  step: '03',
                  title: 'Rules Engine',
                  desc: 'A decision tree maps context + profile to a tailored response. No ML, no external APIs.',
                },
                {
                  step: '04',
                  title: 'Adaptive Response',
                  desc: 'You receive guidance specific to your situation — accessible, multi-language, real-time.',
                },
              ].map(({ step, title, desc }) => (
                <li
                  key={step}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        background: 'rgba(16,185,129,0.12)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {step}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
