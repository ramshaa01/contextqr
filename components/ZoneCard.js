'use client';

import { useRouter } from 'next/navigation';
import { DoorOpen, Armchair, Stethoscope, ArrowRight, Zap } from 'lucide-react';

/**
 * ZoneCard — clickable card that simulates scanning a QR code for a zone type.
 * Props:
 *  - zone: 'gate' | 'seat' | 'medical-post'
 *  - title: string
 *  - description: string
 *  - icon: lucide icon component
 *  - accent: CSS color string for the icon accent
 *  - delay: CSS animation delay class
 */
export default function ZoneCard({ zone, title, description, icon: Icon, accent, delay = '' }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/scan/${zone}`);
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
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
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
          <Zap size={14} aria-hidden="true" />
          <span>Simulate Scan</span>
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
