'use client';

import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import {
  User, MapPin, Clock, Users, ArrowLeft, ArrowRight,
  AlertTriangle, UtensilsCrossed, Coffee, ShoppingBag,
  Toilet, QrCode, Home, Star
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ── Density helpers ─────────────────────────────────────────── */
const DENSITY_CONFIG = {
  low:    { color: '#10b981', label: 'Low',    bars: 1, bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
  medium: { color: '#f59e0b', label: 'Medium', bars: 2, bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  high:   { color: '#ef4444', label: 'High',   bars: 3, bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)' },
};

const TYPE_ICONS = {
  food:        UtensilsCrossed,
  drinks:      Coffee,
  merchandise: ShoppingBag,
  restroom:    Toilet,
};

function DensityBar({ level }) {
  const cfg = DENSITY_CONFIG[level] || DENSITY_CONFIG.low;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '3px' }}>
        {[1, 2, 3].map(b => (
          <div key={b} style={{
            width: '8px', height: '18px', borderRadius: '3px',
            background: b <= cfg.bars ? cfg.color : 'rgba(255,255,255,0.1)',
          }} />
        ))}
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

function StallCard({ stall, timeContext, isRecommended }) {
  const density = stall.crowdByPhase?.[timeContext] || stall.crowdByPhase?.['live'] || 'low';
  const cfg = DENSITY_CONFIG[density];
  const Icon = TYPE_ICONS[stall.type] || UtensilsCrossed;

  return (
    <div
      className="card"
      style={{
        padding: '18px 20px',
        border: isRecommended ? `1.5px solid ${cfg.color}` : '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label={`${stall.name} — ${density} crowd density, ${stall.distanceMeters}m away`}
    >
      {isRecommended && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          display: 'flex', alignItems: 'center', gap: '4px',
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '99px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 700, color: '#10b981',
        }}>
          <Star size={10} fill="currentColor" aria-hidden="true" /> Recommended
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '40px', height: '40px', flexShrink: 0,
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} style={{ color: cfg.color }} aria-hidden="true" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px', paddingRight: isRecommended ? '80px' : '0' }}>
            {stall.name}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stall.location}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <DensityBar level={density} />
        <div style={{ display: 'flex', align: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} aria-hidden="true" /> {stall.distanceMeters}m
          </span>
        </div>
      </div>

      {stall.amenities?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
          {stall.amenities.map(a => (
            <span key={a} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '2px 6px' }}>
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── No-scan fallback ─────────────────────────────────────────── */
function NoScanFallback() {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <div style={{ width: '72px', height: '72px', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <QrCode size={32} style={{ color: 'var(--text-muted)' }} />
      </div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>No scan detected</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 32px' }}>
        This page responds to a QR code scan. Simulate one from the home page to see crowd density and nearby amenities.
      </p>
      <Link href="/" className="btn-primary" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', textDecoration: 'none' }}>
        <Home size={16} aria-hidden="true" /> Back to Zone Simulator
      </Link>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function SeatScanPage() {
  const [scanData, setScanData] = useState(null);
  const [stalls, setStalls] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('scan-result-seat');
    if (stored) setScanData(JSON.parse(stored));
    setLoaded(true);

    // Fetch stalls data
    fetch('/api/stalls').then(r => r.json()).then(data => setStalls(data)).catch(() => {});
  }, []);

  const timeContext = scanData?.timeContext || 'live';
  const nearbyStallIds = scanData?.zoneData?.nearbyStalls || [];

  // Filter stalls to nearby ones, sort by crowd density (low → high)
  const densityOrder = { low: 0, medium: 1, high: 2 };
  const nearbyStalls = stalls
    .filter(s => nearbyStallIds.includes(s.stallId))
    .sort((a, b) => {
      const da = densityOrder[a.crowdByPhase?.[timeContext] || 'low'];
      const db = densityOrder[b.crowdByPhase?.[timeContext] || 'low'];
      return da - db;
    });

  const isWheelchair = scanData?.userProfile?.wheelchairUser;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <main id="main-content" role="main" aria-labelledby="seat-page-heading" style={{ flex: 1, padding: '32px 0 64px' }}>
        <div className="container-app" style={{ maxWidth: '760px' }}>

          <Link href="/" aria-label="Back to zone simulator" className="btn-ghost"
            style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', marginBottom: '28px', fontSize: '0.85rem', textDecoration: 'none' }}>
            <ArrowLeft size={15} aria-hidden="true" /> Back to Simulator
          </Link>

          {loaded && !scanData ? <NoScanFallback /> : (
            <>
              {/* Zone header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.03))',
                border: '1px solid rgba(59,130,246,0.25)',
                borderRadius: '20px',
                padding: 'clamp(20px,4vw,32px)',
                marginBottom: '28px',
                display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap',
              }}>
                <div style={{ width: '60px', height: '60px', flexShrink: 0, background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={28} style={{ color: '#3b82f6' }} aria-hidden="true" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span className="badge badge-info">Zone: Seat</span>
                    <span className="badge badge-success">QR Verified ✓</span>
                    {isWheelchair && <span className="badge badge-warning">♿ Accessible Mode</span>}
                  </div>
                  <h1 id="seat-page-heading" style={{ fontSize: 'clamp(1.3rem,3vw,1.65rem)', fontWeight: 800, marginBottom: '8px' }}>
                    Seat & Area Guide
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {scanData?.zoneData?.description ?? 'Loading your seat context...'}
                  </p>
                </div>
              </div>

              {/* Context indicators */}
              <section aria-labelledby="seat-context-heading" style={{ marginBottom: '28px' }}>
                <h2 id="seat-context-heading" style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Your Location Context
                </h2>
                <div role="list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                  {[
                    { icon: MapPin,  label: 'Section',   value: scanData?.zoneData?.name ?? '—',  accent: '#3b82f6' },
                    { icon: Clock,   label: 'Phase',     value: scanData?.timeContext ?? '—',      accent: '#10b981' },
                    { icon: Users,   label: 'Crowd',     value: scanData?.zoneData?.crowdDensity ?? '—', accent: scanData?.zoneData?.crowdDensity === 'high' ? '#ef4444' : '#10b981' },
                  ].map(({ icon: Icon, label, value, accent }) => (
                    <div key={label} role="listitem" className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icon size={14} style={{ color: accent }} aria-hidden="true" />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recommendations */}
              <section aria-labelledby="guidance-heading" style={{ marginBottom: '28px' }}>
                <h2 id="guidance-heading" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Real-time Guidance</h2>
                <div className="card" aria-live="polite" style={{ padding: '24px' }}>
                  {!scanData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="skeleton" style={{ width: '80%', height: '20px' }} />
                      <div className="skeleton" style={{ width: '100%', height: '16px' }} />
                    </div>
                  ) : (
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', color: '#3b82f6', lineHeight: 1.4 }}>
                        {scanData.primary}
                      </h3>
                      {scanData.alerts?.length > 0 && (
                        <div role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' }}>
                          {scanData.alerts.map((a, i) => (
                            <p key={i} style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                              <AlertTriangle size={14} style={{ marginTop: '2px', flexShrink: 0 }} aria-hidden="true" /> {a}
                            </p>
                          ))}
                        </div>
                      )}
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {scanData.secondary?.map((item, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <ArrowRight size={14} style={{ color: '#3b82f6', marginTop: '3px', flexShrink: 0 }} aria-hidden="true" />
                            <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {/* Nearby stalls with crowd density */}
              <section aria-labelledby="stalls-heading" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h2 id="stalls-heading" style={{ fontSize: '1rem', fontWeight: 700 }}>Nearby Amenities</h2>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>Sorted by crowd density · {timeContext}</span>
                  </div>
                </div>

                {nearbyStalls.length === 0 ? (
                  <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {stalls.length === 0 ? 'Loading amenities...' : 'No nearby amenities found for this zone.'}
                    </p>
                  </div>
                ) : (
                  <div role="list" aria-label="Nearby stalls sorted by crowd density" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {nearbyStalls.map((stall, i) => (
                      <div key={stall.stallId} role="listitem">
                        <StallCard stall={stall} timeContext={timeContext} isRecommended={i === 0} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Tips */}
              {scanData?.tips?.length > 0 && (
                <div role="note" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px' }}>
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
