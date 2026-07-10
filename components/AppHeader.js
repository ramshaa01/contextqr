'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Scan, Sun, ZoomIn, ZoomOut, Menu, X, Wifi } from 'lucide-react';

/**
 * AppHeader — global navigation header
 * Responsive: full controls visible ≥ 480px, hamburger-gated < 480px
 * Features: high-contrast toggle, font-size cycle, scroll shadow
 */
export default function AppHeader() {
  const [hcMode,      setHcMode]      = useState(false);
  const [fontSize,    setFontSize]    = useState('normal');
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);

  // Persist accessibility prefs to html attrs
  useEffect(() => {
    document.documentElement.setAttribute('data-hc', hcMode ? 'true' : 'false');
  }, [hcMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize);
  }, [fontSize]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const cycleFontSize = () =>
    setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal');

  const btnStyle = {
    padding: '8px 10px',
    borderRadius: '8px',
    minWidth: '40px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <header
      role="banner"
      aria-label="ContextQR navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(11,30,61,0.96)' : 'rgba(11,30,61,0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(16,185,129,0.15)',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div
        className="container-app"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', gap: '12px' }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="ContextQR — go to homepage"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}
        >
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Scan size={18} color="#0b1e3d" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Context<span className="gradient-text">QR</span>
          </span>
        </Link>

        {/* Desktop controls (≥ 481px) */}
        {!isMobile && (
          <nav role="navigation" aria-label="Accessibility and status controls" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div role="group" aria-label="Accessibility controls" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setHcMode(prev => !prev)}
                aria-pressed={hcMode}
                aria-label={`High contrast: ${hcMode ? 'on' : 'off'}`}
                title="Toggle high-contrast mode"
                className="btn-ghost"
                style={btnStyle}
              >
                <Sun size={16} aria-hidden="true" />
              </button>
              <button
                onClick={cycleFontSize}
                aria-label={`Font size: ${fontSize}. Click to increase.`}
                title={`Font size: ${fontSize}`}
                className="btn-ghost"
                style={btnStyle}
              >
                {fontSize === 'xlarge'
                  ? <ZoomOut size={16} aria-hidden="true" />
                  : <ZoomIn  size={16} aria-hidden="true" />}
              </button>
            </div>

            <div
              role="status"
              aria-label="System status: live"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: '8px' }}
            >
              <Wifi size={13} aria-hidden="true" style={{ color: 'var(--accent)' }} />
              <span>Live</span>
            </div>
          </nav>
        )}

        {/* Mobile hamburger (< 481px) */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open accessibility menu'}
            className="btn-ghost"
            style={{ ...btnStyle, padding: '8px' }}
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && mobileOpen && (
        <div
          id="mobile-menu"
          role="region"
          aria-label="Mobile accessibility controls"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border)',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => { setHcMode(prev => !prev); setMobileOpen(false); }}
              aria-pressed={hcMode}
              className="btn-ghost"
              style={{ justifyContent: 'flex-start', width: '100%', minHeight: '44px' }}
            >
              <Sun size={16} aria-hidden="true" />
              High Contrast: <strong>{hcMode ? 'On' : 'Off'}</strong>
            </button>
            <button
              onClick={() => { cycleFontSize(); setMobileOpen(false); }}
              className="btn-ghost"
              style={{ justifyContent: 'flex-start', width: '100%', minHeight: '44px' }}
            >
              <ZoomIn size={16} aria-hidden="true" />
              Font Size: <strong>{fontSize}</strong>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Wifi size={13} style={{ color: 'var(--accent)' }} aria-hidden="true" />
              System: Live
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
