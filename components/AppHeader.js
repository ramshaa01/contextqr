'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Scan, Sun, ZoomIn, ZoomOut, Menu, X, Wifi } from 'lucide-react';

/**
 * AppHeader — global navigation header
 * Features: accessibility toggles (high-contrast, font-size), mobile menu
 */
export default function AppHeader() {
  const [hcMode, setHcMode]         = useState(false);
  const [fontSize, setFontSize]     = useState('normal');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  // Persist accessibility preferences to html data attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-hc', hcMode ? 'true' : 'false');
  }, [hcMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize);
  }, [fontSize]);

  // Add scroll shadow to header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cycleFontSize = () => {
    setFontSize(prev =>
      prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal'
    );
  };

  return (
    <header
      role="banner"
      aria-label="ContextQR navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(11, 30, 61, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container-app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

        {/* Logo */}
        <Link
          href="/"
          aria-label="ContextQR — go to homepage"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Scan size={20} color="#0b1e3d" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
            Context<span className="gradient-text">QR</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav role="navigation" aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Accessibility controls */}
          <div
            role="group"
            aria-label="Accessibility controls"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}
          >
            {/* High contrast toggle */}
            <button
              onClick={() => setHcMode(prev => !prev)}
              aria-pressed={hcMode}
              aria-label={`High contrast mode: ${hcMode ? 'on' : 'off'}. Click to toggle.`}
              title="Toggle high-contrast mode"
              className="btn-ghost"
              style={{ padding: '8px', borderRadius: '8px', minWidth: '36px', height: '36px', justifyContent: 'center' }}
            >
              <Sun size={16} aria-hidden="true" />
            </button>

            {/* Font size cycle */}
            <button
              onClick={cycleFontSize}
              aria-label={`Font size: ${fontSize}. Click to increase.`}
              title={`Font size: ${fontSize} (click to cycle)`}
              className="btn-ghost"
              style={{ padding: '8px', borderRadius: '8px', minWidth: '36px', height: '36px', justifyContent: 'center' }}
            >
              {fontSize === 'xlarge' ? <ZoomOut size={16} aria-hidden="true" /> : <ZoomIn size={16} aria-hidden="true" />}
            </button>
          </div>

          {/* Live status indicator */}
          <div
            role="status"
            aria-label="System status: live"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}
          >
            <Wifi size={14} aria-hidden="true" style={{ color: 'var(--accent)' }} />
            <span>Live</span>
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="btn-ghost"
          style={{ display: 'none', padding: '8px', borderRadius: '8px' }}
          id="hamburger-btn"
        >
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="false"
          aria-label="Mobile navigation menu"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border)',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => { setHcMode(prev => !prev); setMobileOpen(false); }}
              aria-pressed={hcMode}
              className="btn-ghost"
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <Sun size={16} aria-hidden="true" />
              High Contrast: {hcMode ? 'On' : 'Off'}
            </button>
            <button
              onClick={() => { cycleFontSize(); setMobileOpen(false); }}
              className="btn-ghost"
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <ZoomIn size={16} aria-hidden="true" />
              Font Size: {fontSize}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
