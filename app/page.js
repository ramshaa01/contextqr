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

        {/* ── Hero Section (Kinetic Modernism) ── */}
        <section
          aria-labelledby="hero-heading"
          style={{
            position: 'relative',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            borderBottom: '1px solid var(--border)',
            backgroundImage: 'var(--stadium-bg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Gradient Mesh Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
            backdropFilter: 'blur(3px)',
            backgroundColor: 'var(--background)',
            opacity: 0.85
          }} />

          {/* Animated CSS Sphere - no image transparency issues */}
          <div className="animate-float" aria-hidden="true" style={{
            position: 'absolute',
            top: '12%',
            right: '8%',
            width: 'clamp(100px, 13vw, 160px)',
            height: 'clamp(100px, 13vw, 160px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(16,185,129,0.9), rgba(6,182,212,0.6) 50%, rgba(16,185,129,0.1) 80%)',
            boxShadow: '0 0 40px rgba(16,185,129,0.35), inset -8px -8px 20px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}>
            {/* Inner highlight */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '20%',
              width: '30%',
              height: '20%',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.4)',
              filter: 'blur(4px)',
            }} />
            {/* Subtle grid lines to suggest a ball */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 0 0 33% rgba(0,0,0,0.05), inset 0 0 0 66% rgba(0,0,0,0.03)',
            }} />
          </div>

          <div className="container-app animate-fade-in-scale" style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%' }}>
            {/* Event badge */}
            <div
              aria-label="Smart Stadium 2026 Challenge"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', background: 'var(--card)', padding: '6px 12px', borderRadius: '99px', border: '1px solid var(--border)' }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                🏟️ Smart Stadium 2026
              </span>
            </div>

            {/* Heading */}
            <h1
              id="hero-heading"
              style={{
                color: 'var(--foreground)',
                marginBottom: '24px',
              }}
            >
              Scan. <span style={{ color: 'var(--primary)' }}>Adapt.</span> Thrive.
            </h1>

            {/* Sub-heading */}
            <p
              className="animate-fade-in-up"
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                color: 'var(--foreground)',
                opacity: 0.8,
                maxWidth: '600px',
                margin: '0 auto 40px',
                lineHeight: 1.6,
              }}
            >
              The same QR code gives you a different, personalised response
              depending on where you scan it, when you scan it, and your
              accessibility profile.
            </p>

            {/* Feature pills */}
            <div
              role="list"
              className="animate-fade-in-up"
              style={{ animationDelay: '200ms', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '48px' }}
            >
              {[
                { icon: QrCode,      label: 'Zone-aware QR' },
                { icon: Cpu,         label: 'Rules engine' },
                { icon: Accessibility, label: 'WCAG AA accessible' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  role="listitem"
                  className="glass"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '99px',
                    fontSize: '0.9rem',
                    color: 'var(--foreground)',
                    fontWeight: 600,
                  }}
                >
                  <Icon size={16} aria-hidden="true" style={{ color: 'var(--primary)' }} />
                  {label}
                </div>
              ))}
            </div>

            {/* Scroll cue */}
            <div
              aria-hidden="true"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--foreground)', opacity: 0.6, fontSize: '0.85rem', fontWeight: 600 }}
            >
              <span>Explore Zones</span>
              <ChevronDown size={24} className="animate-float" />
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
              <p style={{ color: 'var(--foreground)', marginTop: '12px', maxWidth: '480px', margin: '12px auto 0' }}>
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
            background: 'var(--card)',
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
                  <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.6 }}>{desc}</p>
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
