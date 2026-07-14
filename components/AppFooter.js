import Link from 'next/link';
import { Scan, Trophy, Heart } from 'lucide-react';

/**
 * AppFooter — global footer
 */
export default function AppFooter() {
  return (
    <footer
      role="contentinfo"
      aria-label="ContextQR footer"
      style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--card)',
        marginTop: 'auto',
        padding: '32px 0',
      }}
    >
      <style>{`
        .footer-link {
          color: var(--foreground);
          font-size: 0.85rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: var(--accent); }
      `}</style>

      <div className="container-app">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Scan size={16} color="#0b1e3d" aria-hidden="true" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>
              Context<span className="gradient-text">QR</span>
            </span>
          </div>

          {/* Mission statement */}
          <p style={{ color: 'var(--foreground)', fontSize: '0.85rem', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built for{' '}
            <Trophy size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} aria-hidden="true" />
            Smart Stadium 2026 — Smart Stadiums
          </p>

          {/* Links */}
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/" className="footer-link" aria-label="Go to zone simulator">
              Simulator
            </Link>
            <Link href="/scan/gate" className="footer-link" aria-label="Gate zone demo">
              Gate Demo
            </Link>
            <Link href="/scan/medical-post" className="footer-link" aria-label="Medical triage demo">
              Medical Demo
            </Link>
          </nav>
        </div>

        {/* Bottom line */}
        <div className="divider" />
        <p style={{ color: 'var(--foreground)', fontSize: '0.78rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          Made with <Heart size={12} style={{ color: 'var(--danger)', fill: 'currentColor' }} aria-hidden="true" /> for inclusive sports experiences
          &nbsp;·&nbsp;
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }} aria-label="Accessibility features">
            <span aria-hidden="true" title="WCAG AA Compliant, Screen Reader Ready, Keyboard Navigable, Reduced Motion Support, High Contrast Mode">♿ WCAG AA Accessible</span>
            <span className="sr-only">This site supports high contrast, large text, keyboard navigation, reduced motion, and screen readers.</span>
          </span>
        </p>
      </div>
    </footer>
  );
}
