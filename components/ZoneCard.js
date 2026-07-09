'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Zap, Loader2 } from 'lucide-react';

/**
 * ZoneCard — clickable card that simulates scanning a QR code for a zone type.
 */
export default function ZoneCard({ zone, title, description, icon: Icon, accent, delay = '' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Create a mock payload based on zone type
      const payload = {
        zoneType: zone,
        // Optional mock profile: randomly simulate a wheelchair user for gate to show dynamic logic
        userProfile: zone === 'gate' && Math.random() > 0.5 ? { wheelchairUser: true } : {}
      };

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        // Store response in sessionStorage to simulate passing scan result context to the page
        sessionStorage.setItem(`scan-result-${zone}`, JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to fetch scan data", e);
    } finally {
      setLoading(false);
      // Navigate even if fetch failed, so the page can show error or fallback
      router.push(`/scan/${zone}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Simulate QR scan for ${title}. Press Enter to activate.`}
      className={`card animate-fade-up ${delay}`}
      style={{
        padding: '32px 28px',
        cursor: loading ? 'wait' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        opacity: loading ? 0.7 : 1
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Icon container */}
      <div
        aria-hidden="true"
        style={{
          width: '56px',
          height: '56px',
          background: `${accent}18`,
          border: `1.5px solid ${accent}40`,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={28} style={{ color: accent }} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
          {title}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: accent, fontSize: '0.85rem', fontWeight: 600 }}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} aria-hidden="true" />}
          <span>{loading ? 'Scanning...' : 'Simulate Scan'}</span>
        </div>
        <div
          style={{
            width: '32px',
            height: '32px',
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden="true"
        >
          <ArrowRight size={16} style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}
