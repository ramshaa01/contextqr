'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccessibleMotion, transitions } from '@/lib/motion';
import { Loader2, ArrowRight, Zap } from 'lucide-react';

/**
 * ZoneCard — clickable card that simulates scanning a QR code for a zone type.
 */
export default function ZoneCard({ zone, title, description, icon: Icon, accent, delay = '' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Create a mock payload based on zone type
      const payload = {
        zoneType: zone,
        userProfile: zone === 'gate' && Math.random() > 0.5 ? { wheelchairUser: true } : {}
      };

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem(`scan-result-${zone}`, JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to fetch scan data", e);
    } finally {
      setLoading(false);
      router.push(`/scan/${zone}`);
    }
  };

  const motionProps = useAccessibleMotion({
    whileHover: { scale: 1.02, y: -4 },
    whileTap: { scale: 0.98 },
    transition: transitions.spring
  });

  return (
    <motion.div
      {...motionProps}
      role="button"
      onClick={handleScan}
      aria-label={`Simulate QR scan for ${title}. Click to activate.`}
      className={`card ${delay}`}
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
