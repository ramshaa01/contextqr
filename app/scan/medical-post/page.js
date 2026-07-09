import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Stethoscope, MapPin, Clock, Activity, Phone, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Medical Post — ContextQR | FIFA World Cup 2026',
  description: 'Emergency and medical assistance for stadium visitors. Symptom triage, nearest medic, and immediate guidance.',
};

/**
 * Medical-post scan page — shell layout
 * Full symptom triage form will be implemented in Day 3.
 */
export default function MedicalPostScanPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <main id="main-content" role="main" aria-labelledby="medical-page-heading" style={{ flex: 1, padding: '40px 0' }}>
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

          {/* Emergency banner */}
          <div
            role="alert"
            aria-label="Emergency notice — for life-threatening emergencies call 911"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '12px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0 }} aria-hidden="true" />
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f87171' }}>Life-threatening emergency? </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Call <strong style={{ color: 'var(--text-primary)' }}>911</strong> or press the red stadium emergency button immediately.
              </span>
            </div>
          </div>

          {/* Zone header */}
          <div
            aria-label="Medical Post zone context"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))',
              border: '1px solid rgba(245,158,11,0.25)',
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
                background: 'rgba(245,158,11,0.15)',
                border: '2px solid rgba(245,158,11,0.3)',
                borderRadius: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Stethoscope size={32} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <span className="badge badge-warning" style={{ marginRight: '8px' }}>Zone: Medical Post</span>
                <span className="badge badge-success">Staff: Available</span>
              </div>
              <h1 id="medical-page-heading" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
                Medical Assistance
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                You've scanned at a ContextQR medical post. Complete the symptom check below for immediate guidance.
              </p>
            </div>
          </div>

          {/* Medical post status */}
          <section aria-labelledby="post-status-heading" style={{ marginBottom: '32px' }}>
            <h2 id="post-status-heading" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              This Medical Post
            </h2>
            <div
              role="list"
              aria-label="Medical post status"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}
            >
              {[
                { icon: MapPin,    label: 'Location',     value: 'North Concourse', accent: '#f59e0b' },
                { icon: Clock,     label: 'Wait Time',    value: '~3 minutes',      accent: '#10b981' },
                { icon: Activity,  label: 'Status',       value: '● Available',     accent: '#10b981' },
                { icon: Phone,     label: 'Direct Line',  value: '+1-800-MEDIC-1',  accent: '#3b82f6' },
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
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: label === 'Status' ? '#10b981' : 'var(--text-primary)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Triage form placeholder */}
          <section aria-labelledby="triage-heading">
            <h2 id="triage-heading" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              Quick Symptom Check
            </h2>
            <div
              className="card"
              aria-label="Symptom triage form — loading"
              aria-live="polite"
              aria-busy="true"
              style={{ padding: '40px', textAlign: 'center' }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: '56px', height: '56px',
                  background: 'rgba(245,158,11,0.1)',
                  border: '2px solid rgba(245,158,11,0.2)',
                  borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Stethoscope size={28} style={{ color: '#f59e0b' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Symptom Triage Form</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto 24px' }}>
                Select your symptoms → get an instant severity assessment → nearest available medic.
              </p>
              <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div className="skeleton" style={{ height: '44px', borderRadius: '10px' }} />
                <div className="skeleton" style={{ height: '44px', borderRadius: '10px' }} />
                <div className="skeleton" style={{ height: '44px', borderRadius: '10px' }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                🔧 Triage form wiring in progress — Day 3 task
              </p>
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
