'use client';

import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import {
  Stethoscope, MapPin, Clock, Activity, Phone,
  ArrowLeft, AlertTriangle, CheckCircle, Info,
  QrCode, Home, Siren, HeartPulse, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AskContextQR from '@/components/AskContextQR';
import { useAccessibleMotion } from '@/lib/motion';

/* ── Triage severity config ──────────────────────────────────── */
const SEVERITY = {
  urgent: {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.12)',
    border: 'rgba(248,113,113,0.35)',
    label: '🚨 URGENT',
    icon: Siren,
    responseTime: '< 2 minutes',
    tone: 'Stay where you are. A medic is being dispatched to your exact location.',
  },
  moderate: {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.3)',
    label: '⚠ MODERATE',
    icon: AlertTriangle,
    responseTime: '5–10 minutes',
    tone: 'Please proceed to the nearest Medical Post. Staff are aware.',
  },
  'self-care': {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
    label: '✓ SELF-CARE',
    icon: ShieldCheck,
    responseTime: 'No dispatch required',
    tone: 'Your symptoms are mild. Visit the first-aid kiosk for basic supplies.',
  },
};

/* ── No-scan fallback ─────────────────────────────────────────── */
function NoScanFallback() {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <div style={{
        width: '72px', height: '72px',
        background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
      }}>
        <QrCode size={32} style={{ color: 'var(--foreground)' }} />
      </div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>No scan detected</h2>
      <p style={{ color: 'var(--foreground)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 32px' }}>
        This page responds to a QR code scan. Simulate one from the home page to access medical assistance.
      </p>
      <Link href="/" className="btn-primary"
        style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', textDecoration: 'none' }}>
        <Home size={16} aria-hidden="true" /> Back to Zone Simulator
      </Link>
    </div>
  );
}

/* ── Triage result card ──────────────────────────────────────── */
function TriageResult({ result, postInfo, onReset }) {
  const cfg = SEVERITY[result.severity] || SEVERITY['self-care'];
  const SevIcon = cfg.icon;

  const isUrgent = result.severity === 'urgent';
  const motionProps = useAccessibleMotion({
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  });

  return (
    <motion.div aria-live={isUrgent ? "assertive" : "polite"} aria-atomic="true" {...motionProps}>
      {/* Main severity banner */}
      <motion.div
        animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
        transition={isUrgent ? { duration: 0.4, ease: 'easeOut' } : {}}
        style={{
        background: cfg.bg, border: `2px solid ${cfg.border}`,
        borderRadius: '16px', padding: 'clamp(20px,4vw,32px)',
        marginBottom: '20px', textAlign: 'center',
      }}>
        <div style={{
          width: '64px', height: '64px',
          background: `${cfg.color}20`, border: `2px solid ${cfg.color}40`,
          borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <SevIcon size={30} style={{ color: cfg.color }} aria-hidden="true" />
        </div>

        <h3 style={{
          color: cfg.color,
          fontSize: result.severity === 'urgent' ? 'clamp(1.5rem,4vw,2rem)' : '1.4rem',
          fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '12px',
          textTransform: 'uppercase',
        }}>
          {cfg.label}
        </h3>

        <p style={{ fontSize: 'clamp(0.9rem,2vw,1.05rem)', lineHeight: 1.65, color: 'var(--foreground)', maxWidth: '440px', margin: '0 auto 16px' }}>
          {result.recommendation}
        </p>

        {/* Contextual tone */}
        <p style={{ fontSize: '0.85rem', color: cfg.color, fontWeight: 600 }}>{cfg.tone}</p>

        {result.alertMedic && (
          <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, borderRadius: '8px', padding: '8px 14px' }}>
            <CheckCircle size={14} style={{ color: cfg.color }} aria-hidden="true" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: cfg.color }}>Medic notified</span>
          </div>
        )}
      </motion.div>

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        {[
          { icon: Clock,       label: 'Est. Response',  value: cfg.responseTime,                         accent: cfg.color },
          { icon: MapPin,      label: 'Nearest Post',   value: postInfo?.name ?? 'Medical Post 1',       accent: '#3b82f6' },
          { icon: Activity,    label: 'Post Status',    value: postInfo?.availability ?? 'available',     accent: '#10b981' },
          { icon: HeartPulse,  label: 'Staff On-site',  value: `${postInfo?.staffCount ?? 3} paramedics`, accent: '#f59e0b' },
        ].map(({ icon: Icon, label, value, accent }) => (
          <div key={label} className="card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Icon size={13} style={{ color: accent }} aria-hidden="true" />
              <span style={{ fontSize: '0.7rem', color: 'var(--foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={onReset} className="btn-ghost" style={{ minHeight: '44px', minWidth: '120px' }}>
          ← Start Over
        </button>
      </div>
    </motion.div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function MedicalPostScanPage() {
  const [scanData, setScanData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [triageResult, setTriageResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [freeTextInput, setFreeTextInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const SYMPTOMS = [
    { label: 'Chest pain',             value: 'chest pain' },
    { label: 'Breathing difficulty',   value: 'breathing difficulty' },
    { label: 'Dizziness',              value: 'dizziness' },
    { label: 'Allergic reaction',      value: 'allergic reaction' },
    { label: 'Headache',               value: 'headache' },
    { label: 'Minor cut / graze',      value: 'minor cut' },
  ];

  useEffect(() => {
    const stored = sessionStorage.getItem('scan-result-medical-post');
    if (stored) setScanData(JSON.parse(stored));
    setLoaded(true);
  }, []);

  const postInfo = scanData?.postInfo;

  const toggleSymptom = (val) =>
    setSelectedSymptoms(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalSymptoms = [...selectedSymptoms];

    // Layer 1: AI Parsing of free-text input
    if (freeTextInput.trim() !== '') {
      setIsParsing(true);
      setError('');
      try {
        const parseRes = await fetch('/api/parse-symptoms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ freeTextInput: freeTextInput.trim() }),
        });
        if (!parseRes.ok) throw new Error('AI Parsing failed');
        const parseData = await parseRes.json();
        
        if (parseData.tags && parseData.tags.length > 0) {
          finalSymptoms = [...new Set([...finalSymptoms, ...parseData.tags])];
          setSelectedSymptoms(finalSymptoms); // update UI to show what was selected
        } else if (finalSymptoms.length === 0) {
          setError("We couldn't clearly identify your symptoms. Please use the checkboxes instead.");
          setIsParsing(false);
          return;
        }
      } catch (err) {
        setError("AI parsing is currently unavailable. Please use the checkboxes instead.");
        setIsParsing(false);
        return;
      }
      setIsParsing(false);
    }

    if (!finalSymptoms.length) { setError('Please select or describe at least one symptom.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/medical-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      if (!res.ok) throw new Error('Server error');
      setTriageResult(await res.json());
    } catch {
      setError('Could not reach the triage service. Please find the nearest medical staff.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <main id="main-content" role="main" aria-labelledby="medical-page-heading" style={{ flex: 1, padding: '32px 0 64px' }}>
        <div className="container-app" style={{ maxWidth: '720px' }}>

          <Link href="/" aria-label="Back to zone simulator" className="btn-ghost"
            style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', marginBottom: '24px', fontSize: '0.85rem', textDecoration: 'none' }}>
            <ArrowLeft size={15} aria-hidden="true" /> Back to Simulator
          </Link>

          {/* Hackathon disclaimer */}
          <div role="note" aria-label="Demo disclaimer" style={{
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: '10px', padding: '12px 16px',
            display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px',
          }}>
            <Info size={16} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
            <p style={{ fontSize: '0.8rem', color: 'var(--foreground)', lineHeight: 1.5 }}>
              <strong style={{ color: '#60a5fa' }}>Demo only:</strong> This is a simulated prototype for the Smart Stadium 2026 challenge. It does not provide real medical advice. In a real emergency, contact stadium medical staff or call <strong>911</strong> immediately.
            </p>
          </div>

          {/* Emergency banner */}
          <div role="alert" aria-label="Emergency hotline reminder" style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px',
          }}>
            <AlertTriangle size={18} style={{ color: '#ef4444', flexShrink: 0 }} aria-hidden="true" />
            <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
              <strong style={{ color: '#f87171' }}>Life-threatening emergency?</strong>{' '}
              <span style={{ color: 'var(--foreground)' }}>Call <strong style={{ color: '#f8fafc' }}>911</strong> or press the red stadium emergency button immediately.</span>
            </p>
          </div>

          {loaded && !scanData ? <NoScanFallback /> : (
            <>
              {/* Zone header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03))',
                border: '1px solid rgba(245,158,11,0.25)', borderRadius: '20px',
                padding: 'clamp(20px,4vw,32px)', marginBottom: '28px',
                display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap',
              }}>
                <div style={{ width: '60px', height: '60px', flexShrink: 0, background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stethoscope size={28} style={{ color: '#f59e0b' }} aria-hidden="true" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span className="badge badge-warning">Zone: Medical Post</span>
                    <span className="badge badge-success">
                      Staff: {postInfo?.availability ?? 'Available'}
                    </span>
                    {scanData?.userProfile?.medicalFlag && (
                      <span className="badge badge-danger">⚠ Medical Flag on Profile</span>
                    )}
                  </div>
                  <h1 id="medical-page-heading" style={{ fontSize: 'clamp(1.3rem,3vw,1.65rem)', fontWeight: 800, marginBottom: '8px' }}>
                    Medical Assistance
                  </h1>
                  <p style={{ color: 'var(--foreground)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    You&apos;ve scanned at <strong style={{ color: 'var(--foreground)' }}>{postInfo?.name ?? 'Medical Post 1 — North Concourse'}</strong>.
                    Complete the symptom check below for immediate guidance.
                  </p>
                </div>
              </div>

              {/* Medical post status row */}
              <section aria-labelledby="post-status-heading" style={{ marginBottom: '28px' }}>
                <h2 id="post-status-heading" style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '14px', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  This Medical Post
                </h2>
                <div role="list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '10px' }}>
                  {[
                    { icon: MapPin,     label: 'Location',    value: postInfo?.name?.split('—')[1]?.trim() ?? 'North Concourse', accent: '#f59e0b' },
                    { icon: Clock,      label: 'Wait Time',   value: `~${postInfo?.waitMinutes ?? 3} min`,      accent: '#10b981' },
                    { icon: Activity,   label: 'Status',      value: postInfo?.availability ?? 'Available',     accent: '#10b981' },
                    { icon: Phone,      label: 'Direct Line', value: '+1-800-MEDIC-1',                          accent: '#3b82f6' },
                  ].map(({ icon: Icon, label, value, accent }) => (
                    <div key={label} role="listitem" className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icon size={13} style={{ color: accent }} aria-hidden="true" />
                        <span style={{ fontSize: '0.7rem', color: 'var(--foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: label === 'Status' ? '#10b981' : 'var(--foreground)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Triage section */}
              <section aria-labelledby="triage-heading">
                <h2 id="triage-heading" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
                  Quick Symptom Check
                </h2>
                <div className="card" style={{ padding: 'clamp(20px,4vw,36px)' }}>
                  <AnimatePresence mode="wait">
                  {triageResult ? (
                    <TriageResult
                      key="result"
                      result={triageResult}
                      postInfo={postInfo}
                      onReset={() => { setTriageResult(null); setSelectedSymptoms([]); }}
                    />
                  ) : (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit}>
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ width: '52px', height: '52px', background: 'rgba(245,158,11,0.1)', border: '2px solid rgba(245,158,11,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                          <Stethoscope size={24} style={{ color: '#f59e0b' }} aria-hidden="true" />
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Select your symptoms</h3>
                        <p style={{ color: 'var(--foreground)', fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto' }}>
                          Tap all that apply or describe how you feel → instant severity assessment.
                        </p>
                      </div>

                      {/* Natural Language Input */}
                      <div style={{ marginBottom: '24px' }}>
                        <label htmlFor="symptom-text" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
                          Describe how you&apos;re feeling:
                        </label>
                        <textarea
                          id="symptom-text"
                          rows={3}
                          value={freeTextInput}
                          onChange={(e) => setFreeTextInput(e.target.value)}
                          placeholder="e.g., My chest hurts and I feel dizzy..."
                          style={{
                            width: '100%', padding: '12px', borderRadius: '10px',
                            border: '1px solid var(--border)', background: 'var(--background)',
                            color: 'var(--foreground)', fontSize: '0.9rem', resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                        />
                        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--foreground)', opacity: 0.8, display: 'flex', gap: '6px' }}>
                          <ShieldCheck size={14} style={{ color: '#10b981' }} />
                          <em>AI-assisted symptom parsing — final triage classification uses fixed medical logic, not AI judgment.</em>
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--foreground)', fontWeight: 600 }}>OR SELECT MANUALLY</div>

                      <fieldset style={{ border: 'none', padding: 0, margin: '0 0 24px' }}>
                        <legend className="sr-only">Symptom checklist</legend>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                          {SYMPTOMS.map(({ label, value }) => {
                            const selected = selectedSymptoms.includes(value);
                            return (
                              <label
                                key={value}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '10px',
                                  cursor: 'pointer', padding: '12px 14px',
                                  background: selected ? 'rgba(245,158,11,0.1)' : 'var(--card)',
                                  border: `1px solid ${selected ? 'rgba(245,158,11,0.4)' : 'var(--border)'}`,
                                  borderRadius: '10px',
                                  minHeight: '44px',
                                  transition: 'border-color 0.15s, background 0.15s',
                                }}
                              >
                                <input
                                  type="checkbox"
                                  value={value}
                                  checked={selected}
                                  onChange={() => toggleSymptom(value)}
                                  style={{ width: '18px', height: '18px', accentColor: '#f59e0b', flexShrink: 0 }}
                                  aria-label={label}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: selected ? 600 : 400 }}>{label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>

                      {error && (
                        <p role="alert" style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '16px' }}>
                          {error}
                        </p>
                      )}

                      <div style={{ textAlign: 'center' }}>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-primary"
                          style={{ minHeight: '48px', minWidth: '180px', fontSize: '1rem' }}
                          aria-label="Submit symptoms for triage assessment"
                        >
                          {isParsing ? 'Parsing Symptoms...' : submitting ? 'Processing...' : 'Submit Symptoms →'}
                        </button>
                      </div>
                    </motion.form>
                  )}
                  </AnimatePresence>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <AppFooter />
      {scanData && <AskContextQR currentContext={{ ...scanData, postInfo: scanData.postInfo || null }} />}
    </div>
  );
}
