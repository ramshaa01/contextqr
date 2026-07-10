'use client';

import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import {
  DoorOpen, MapPin, Clock, Accessibility,
  QrCode, ArrowLeft, ArrowRight, Navigation,
  AlertTriangle, CheckCircle, Home
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ── Mini-map: abstract SVG stadium diagram ─────────────────── */
function StadiumMiniMap({ highlightGate = 'north', isAccessible = false }) {
  const accent = '#10b981';
  const highlight = isAccessible ? '#3b82f6' : accent;

  return (
    <div
      role="img"
      aria-label={`Stadium map highlighting the ${highlightGate} gate entry point${isAccessible ? ' with accessible route' : ''}`}
      style={{
        background: 'rgba(11,30,61,0.8)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <svg viewBox="0 0 200 160" width="100%" style={{ maxWidth: '280px' }} aria-hidden="true">
        {/* Stadium oval outline */}
        <ellipse cx="100" cy="80" rx="88" ry="66" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="2" />
        {/* Pitch */}
        <ellipse cx="100" cy="80" rx="58" ry="42" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
        {/* Centre circle */}
        <circle cx="100" cy="80" r="14" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
        {/* Halfway line */}
        <line x1="100" y1="38" x2="100" y2="122" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />

        {/* Gate markers — North (A), South (B), East, West */}
        {/* North Gate A */}
        <rect x="88" y="8" width="24" height="12" rx="4"
          fill={highlightGate === 'north' ? highlight : 'rgba(255,255,255,0.06)'}
          stroke={highlightGate === 'north' ? highlight : 'rgba(255,255,255,0.15)'}
          strokeWidth="1.5"
        />
        <text x="100" y="17" textAnchor="middle" fontSize="7" fill={highlightGate === 'north' ? '#fff' : '#94a3b8'} fontWeight="700">A</text>

        {/* South Gate B */}
        <rect x="88" y="140" width="24" height="12" rx="4"
          fill={highlightGate === 'south' ? highlight : 'rgba(255,255,255,0.06)'}
          stroke={highlightGate === 'south' ? highlight : 'rgba(255,255,255,0.15)'}
          strokeWidth="1.5"
        />
        <text x="100" y="149" textAnchor="middle" fontSize="7" fill={highlightGate === 'south' ? '#fff' : '#94a3b8'} fontWeight="700">B</text>

        {/* East Gate */}
        <rect x="180" y="74" width="16" height="12" rx="4"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
        />
        <text x="188" y="83" textAnchor="middle" fontSize="6" fill="#94a3b8" fontWeight="700">E</text>

        {/* West Gate */}
        <rect x="4" y="74" width="16" height="12" rx="4"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
        />
        <text x="12" y="83" textAnchor="middle" fontSize="6" fill="#94a3b8" fontWeight="700">W</text>

        {/* Accessible path dotted line (north only) */}
        {isAccessible && highlightGate === 'north' && (
          <line x1="100" y1="20" x2="100" y2="38"
            stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2"
          />
        )}

        {/* Wheelchair icon for accessible gate */}
        {isAccessible && (
          <text x="76" y="17" fontSize="8" fill="#3b82f6">♿</text>
        )}

        {/* You are here dot */}
        <circle cx="100" cy={highlightGate === 'north' ? 24 : 136} r="4" fill={highlight} />
        <circle cx="100" cy={highlightGate === 'north' ? 24 : 136} r="7" fill="none" stroke={highlight} strokeWidth="1.5" opacity="0.5" />
      </svg>

      <div style={{ display: 'flex', gap: '16px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: highlight, display: 'inline-block' }} />
          Your Gate
        </span>
        {isAccessible && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '14px', borderTop: '2px dashed #3b82f6', display: 'inline-block' }} />
            Accessible path
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'inline-block' }} />
          Other gates
        </span>
      </div>
    </div>
  );
}

/* ── Fallback state when no scan session exists ─────────────── */
function NoScanFallback() {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <div style={{
        width: '72px', height: '72px',
        background: 'rgba(148,163,184,0.1)',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
      }}>
        <QrCode size={32} style={{ color: 'var(--text-muted)' }} />
      </div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>No scan detected</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 32px' }}>
        This page responds to a QR code scan. Simulate one from the home page to see your personalised entry guidance.
      </p>
      <Link href="/" className="btn-primary" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', textDecoration: 'none' }}>
        <Home size={16} aria-hidden="true" />
        Back to Zone Simulator
      </Link>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────── */
export default function GateScanPage() {
  const [scanData, setScanData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('scan-result-gate');
    if (stored) setScanData(JSON.parse(stored));
    setLoaded(true);
  }, []);

  const isWheelchair = scanData?.userProfile?.wheelchairUser;
  const highlightGate = scanData?.zoneData?.zoneId?.includes('gate-b') ? 'south' : 'north';
  const accent = '#10b981';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <main id="main-content" role="main" aria-labelledby="gate-page-heading" style={{ flex: 1, padding: '32px 0 64px' }}>
        <div className="container-app" style={{ maxWidth: '760px' }}>

          {/* Back nav */}
          <Link href="/" aria-label="Back to zone simulator" className="btn-ghost"
            style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', marginBottom: '28px', fontSize: '0.85rem', textDecoration: 'none' }}>
            <ArrowLeft size={15} aria-hidden="true" /> Back to Simulator
          </Link>

          {/* Render fallback if no scan data yet */}
          {loaded && !scanData ? (
            <NoScanFallback />
          ) : (
            <>
              {/* Zone header card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.03))',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '20px',
                padding: 'clamp(20px,4vw,32px)',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  width: '60px', height: '60px', flexShrink: 0,
                  background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)',
                  borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <DoorOpen size={28} style={{ color: accent }} aria-hidden="true" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span className="badge badge-success">Zone: Gate</span>
                    <span className="badge badge-info">QR Verified ✓</span>
                    {isWheelchair && <span className="badge badge-warning">♿ Accessible Mode</span>}
                  </div>
                  <h1 id="gate-page-heading" style={{ fontSize: 'clamp(1.3rem,3vw,1.65rem)', fontWeight: 800, marginBottom: '8px' }}>
                    Gate Entry Assistance
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {scanData ? scanData.zoneData?.description : 'Loading your entry guidance...'}
                  </p>
                </div>
              </div>

              {/* Context indicators */}
              <section aria-labelledby="context-heading" style={{ marginBottom: '28px' }}>
                <h2 id="context-heading" style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Detected Context
                </h2>
                <div role="list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  {[
                    { icon: MapPin,        label: 'Gate',        value: scanData?.zoneData?.name ?? '—',           accent: '#10b981' },
                    { icon: Clock,         label: 'Match Phase', value: scanData?.timeContext ?? '—',               accent: '#3b82f6' },
                    { icon: Accessibility, label: 'Profile',     value: isWheelchair ? 'Wheelchair ♿' : 'Standard', accent: '#f59e0b' },
                    { icon: CheckCircle,   label: 'QR Status',   value: 'Verified ✓',                              accent: '#10b981' },
                  ].map(({ icon: Icon, label, value, accent: ac }) => (
                    <div key={label} role="listitem" className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icon size={14} style={{ color: ac }} aria-hidden="true" />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Two column: guidance + map */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>

                {/* Guidance card */}
                <section aria-labelledby="guidance-heading">
                  <h2 id="guidance-heading" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Your Entry Guidance</h2>
                  <div className="card" aria-live="polite" style={{ padding: '24px', height: '100%' }}>
                    {!scanData ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="skeleton" style={{ width: '80%', height: '20px' }} />
                        <div className="skeleton" style={{ width: '100%', height: '16px' }} />
                        <div className="skeleton" style={{ width: '90%', height: '16px' }} />
                      </div>
                    ) : (
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', color: accent, lineHeight: 1.4 }}>
                          {scanData.primary}
                        </h3>

                        {scanData.alerts?.length > 0 && (
                          <div role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' }}>
                            {scanData.alerts.map((a, i) => (
                              <p key={i} style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                                <AlertTriangle size={14} style={{ marginTop: '2px', flexShrink: 0 }} aria-hidden="true" />
                                {a}
                              </p>
                            ))}
                          </div>
                        )}

                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                          {scanData.secondary?.map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <ArrowRight size={14} style={{ color: accent, marginTop: '3px', flexShrink: 0 }} aria-hidden="true" />
                              <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Get Directions button */}
                        <button
                          onClick={() => alert(`📍 Directions to ${scanData.zoneData?.name}:\n\nHead towards the ${highlightGate === 'north' ? 'North' : 'South'} side of the stadium.\n${isWheelchair ? '♿ Follow the blue accessible lane markers.' : 'Follow the green entry signs.'}\n\n[Demo: Real GPS would activate here]`)}
                          className="btn-primary"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px', minHeight: '44px' }}
                          aria-label={`Get directions to ${scanData.zoneData?.name}`}
                        >
                          <Navigation size={16} aria-hidden="true" />
                          Get Directions
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Mini-map */}
                <section aria-labelledby="map-heading">
                  <h2 id="map-heading" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Stadium Map</h2>
                  <StadiumMiniMap highlightGate={highlightGate} isAccessible={!!isWheelchair} />
                </section>
              </div>

              {/* Accessible route details */}
              {scanData?.accessibleRoute && (
                <div role="note" aria-label="Accessible route details" style={{
                  background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: '14px',
                  padding: '20px 24px',
                  marginBottom: '24px',
                }}>
                  <h3 style={{ color: '#3b82f6', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                    <Accessibility size={16} aria-hidden="true" /> Accessible Route — {scanData.accessibleRoute.estimatedTime} min estimated
                  </h3>
                  <ol style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    {scanData.accessibleRoute.steps?.map(s => (
                      <li key={s.step}>{s.instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tips */}
              {scanData?.tips?.length > 0 && (
                <div role="note" aria-label="Helpful tips" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>💡 Tips</p>
                  <ul style={{ paddingLeft: '18px', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                    {scanData.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
