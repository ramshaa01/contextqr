import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { DoorOpen, MapPin, Clock, Accessibility, QrCode, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Gate Entry — ContextQR | FIFA World Cup 2026',
  description: 'Context-aware gate entry guidance for stadium visitors. Accessible routes, queue info, and time-based assistance.',
};

/**
 * Gate scan page — shell layout
 * Logic will be wired to /api/scan in Day 2.
 * Currently shows the layout structure with placeholder content.
 */
export default function GateScanPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <main id="main-content" role="main" aria-labelledby="gate-page-heading" style={{ flex: 1, padding: '40px 0' }}>
        <div className="container-app" style={{ maxWidth: '720px' }}>

          {/* Back navigation */}
          <Link
            href="/"
            aria-label="Back to zone simulator"
            className="btn-ghost"
            style={{ display: 'inline-flex', marginBottom: '32px', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Simulator
          </Link>

          {/* Zone header */}
          <div
            aria-label="Gate Entry zone context"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: '64px', height: '64px',
                background: 'rgba(16,185,129,0.15)',
                border: '2px solid rgba(16,185,129,0.3)',
                borderRadius: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <DoorOpen size={32} style={{ color: '#10b981' }} />
            </div>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <span className="badge badge-success" style={{ marginRight: '8px' }}>Zone: Gate</span>
                <span className="badge badge-info">QR Scan Simulated</span>
              </div>
              <h1 id="gate-page-heading" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
                Gate Entry Assistance
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Welcome to ContextQR. Your entry guidance is being prepared based on your zone, time context, and accessibility profile.
              </p>
            </div>
          </div>

          {/* Context indicators — skeleton placeholders (will be populated Day 3) */}
          <section aria-labelledby="context-heading" style={{ marginBottom: '32px' }}>
            <h2 id="context-heading" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>
              Detected Context
            </h2>
            <div
              role="list"
              aria-label="Context information"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}
            >
              {[
                { icon: MapPin,        label: 'Zone',      value: 'Gate Entry',  accent: '#10b981' },
                { icon: Clock,         label: 'Match Phase', value: 'Pre-Match', accent: '#3b82f6' },
                { icon: Accessibility, label: 'Profile',   value: 'Standard',    accent: '#f59e0b' },
                { icon: QrCode,        label: 'QR Status', value: 'Verified ✓',  accent: '#10b981' },
              ].map(({ icon: Icon, label, value, accent }) => (
                <div
                  key={label}
                  role="listitem"
                  className="card"
                  style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={16} style={{ color: accent }} aria-hidden="true" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {label}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Primary action area — Day 3 will render real response here */}
          <section aria-labelledby="guidance-heading" style={{ marginBottom: '24px' }}>
            <h2 id="guidance-heading" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              Your Entry Guidance
            </h2>
            <div
              className="card"
              aria-live="polite"
              aria-busy="true"
              style={{ padding: '32px', textAlign: 'center' }}
            >
              {/* Skeleton placeholder */}
              <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: '60%', height: '24px' }} />
                <div className="skeleton" style={{ width: '80%', height: '16px' }} />
                <div className="skeleton" style={{ width: '70%', height: '16px' }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '24px' }}>
                🔧 Decision engine wiring in progress — Day 2 task
              </p>
            </div>
          </section>

          {/* Accessibility info */}
          <div
            role="note"
            aria-label="Accessibility information"
            style={{
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <Accessibility size={20} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Accessibility note</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Wheelchair-accessible lanes, audio guides, and tactile paths are available at Gate A.
                Staff assistance is available at all times.
              </p>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
