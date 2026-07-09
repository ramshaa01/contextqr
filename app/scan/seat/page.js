'use client';

import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { User, MapPin, Clock, Users, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SeatScanPage() {
  const [scanData, setScanData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('scan-result-seat');
    if (stored) {
      setScanData(JSON.parse(stored));
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <main id="main-content" role="main" aria-labelledby="seat-page-heading" style={{ flex: 1, padding: '40px 0' }}>
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
            aria-label="Seat zone context"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))',
              border: '1px solid rgba(59,130,246,0.25)',
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
                background: 'rgba(59,130,246,0.15)',
                border: '2px solid rgba(59,130,246,0.3)',
                borderRadius: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={32} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <span className="badge badge-info" style={{ marginRight: '8px' }}>Zone: Seat</span>
                {scanData?.userProfile?.wheelchairUser && (
                   <span className="badge badge-warning">Accessibility Mode</span>
                )}
              </div>
              <h1 id="seat-page-heading" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
                Seat & Area Guide
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                ContextQR is mapping services around your specific seat location and current match phase.
              </p>
            </div>
          </div>

          {/* Context indicators */}
          <section aria-labelledby="context-heading" style={{ marginBottom: '32px' }}>
            <h2 id="context-heading" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your Location Context
            </h2>
            <div
              role="list"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}
            >
              {[
                { icon: MapPin, label: 'Section', value: scanData ? scanData.zoneData.name : '...', accent: '#3b82f6' },
                { icon: Clock,  label: 'Phase',   value: scanData ? scanData.timeContext : '...', accent: '#10b981' },
                { icon: Users,  label: 'Crowd',   value: scanData ? scanData.zoneData.crowdDensity : '...', accent: scanData?.zoneData?.crowdDensity === 'high' ? '#ef4444' : '#10b981' },
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

          {/* Real-time guidance */}
          <section aria-labelledby="guidance-heading" style={{ marginBottom: '24px' }}>
            <h2 id="guidance-heading" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              Real-time Recommendations
            </h2>
            <div className="card" aria-live="polite" style={{ padding: '32px' }}>
              {!scanData ? (
                <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: '60%', height: '24px' }} />
                  <div className="skeleton" style={{ width: '80%', height: '16px' }} />
                  <div className="skeleton" style={{ width: '70%', height: '16px' }} />
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--accent)' }}>
                    {scanData.primary}
                  </h3>

                  {scanData.alerts?.length > 0 && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(239,68,68,0.3)' }}>
                      {scanData.alerts.map((alert, i) => (
                        <p key={i} style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <AlertTriangle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                          {alert}
                        </p>
                      ))}
                    </div>
                  )}

                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    {scanData.secondary?.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <ArrowRight size={16} style={{ color: 'var(--accent)', marginTop: '4px' }} />
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {scanData.nearbyStall && (
                     <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '8px', marginTop: '16px', border: '1px solid var(--border)' }}>
                        <h4 style={{ fontWeight: 700, marginBottom: '4px', fontSize: '0.95rem' }}>Smart Recommendation</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Since it's half-time, head to <strong>{scanData.nearbyStall}</strong> for the shortest queue.
                        </p>
                     </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Tips info */}
          {scanData?.tips && scanData.tips.length > 0 && (
            <div
              role="note"
              aria-label="Tips"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Useful Tips</p>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {scanData.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
