'use client';

import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Stethoscope, MapPin, Clock, Activity, Phone, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MedicalPostScanPage() {
  const [scanData, setScanData] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [triageResult, setTriageResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const symptomsList = [
    'Chest pain',
    'Breathing difficulty',
    'Dizziness',
    'Minor cut',
    'Headache',
    'Allergic reaction'
  ];

  useEffect(() => {
    const stored = sessionStorage.getItem('scan-result-medical-post');
    if (stored) {
      setScanData(JSON.parse(stored));
    }
  }, []);

  const handleCheckboxChange = (symptom) => {
    setSelectedSymptoms((prev) => 
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/medical-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch triage result');
      }

      const data = await res.json();
      setTriageResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getResultStyle = (severity) => {
    switch (severity) {
      case 'urgent':
        return { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' };
      case 'moderate':
        return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b' };
      case 'self-care':
        return { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', color: '#10b981' };
      default:
        return { bg: 'var(--bg-surface)', border: 'var(--border)', color: 'var(--text-primary)' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <main id="main-content" role="main" aria-labelledby="medical-page-heading" style={{ flex: 1, padding: '40px 0' }}>
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

          {/* Emergency banner */}
          <div
            role="alert"
            aria-label="Emergency notice — for life-threatening emergencies call 911"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '12px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0 }} aria-hidden="true" />
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f87171' }}>Life-threatening emergency? </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Call <strong style={{ color: 'var(--text-primary)' }}>911</strong> or press the red stadium emergency button immediately.
              </span>
            </div>
          </div>

          {/* Zone header */}
          <div
            aria-label="Medical Post zone context"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))',
              border: '1px solid rgba(245,158,11,0.25)',
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
                background: 'rgba(245,158,11,0.15)',
                border: '2px solid rgba(245,158,11,0.3)',
                borderRadius: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Stethoscope size={32} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <span className="badge badge-warning" style={{ marginRight: '8px' }}>Zone: Medical Post</span>
                <span className="badge badge-success">Staff: {scanData ? scanData.postInfo.availability : 'Loading...'}</span>
              </div>
              <h1 id="medical-page-heading" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
                Medical Assistance
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                You've scanned at {scanData ? scanData.postInfo.name : 'a ContextQR medical post'}. Complete the symptom check below for immediate guidance.
              </p>
            </div>
          </div>

          {/* Medical post status */}
          <section aria-labelledby="post-status-heading" style={{ marginBottom: '32px' }}>
            <h2 id="post-status-heading" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              This Medical Post
            </h2>
            <div
              role="list"
              aria-label="Medical post status"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}
            >
              {[
                { icon: MapPin,    label: 'Location',     value: scanData ? scanData.zoneData.name : '...', accent: '#f59e0b' },
                { icon: Clock,     label: 'Wait Time',    value: scanData ? `~${scanData.postInfo.waitMinutes} mins` : '...',      accent: '#10b981' },
                { icon: Activity,  label: 'Status',       value: scanData ? scanData.postInfo.availability : '...',     accent: '#10b981' },
                { icon: Phone,     label: 'Direct Line',  value: '+1-800-MEDIC-1',  accent: '#3b82f6' },
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
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: label === 'Status' ? '#10b981' : 'var(--text-primary)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Triage form */}
          <section aria-labelledby="triage-heading">
            <h2 id="triage-heading" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              Quick Symptom Check
            </h2>
            <div className="card" style={{ padding: '40px' }}>
              
              {!triageResult ? (
                <form onSubmit={handleSubmit}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: '56px', height: '56px',
                      background: 'rgba(245,158,11,0.1)',
                      border: '2px solid rgba(245,158,11,0.2)',
                      borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}
                  >
                    <Stethoscope size={28} style={{ color: '#f59e0b' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Symptom Triage Form</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto 24px', textAlign: 'center' }}>
                    Select your symptoms → get an instant severity assessment → nearest available medic.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    {symptomsList.map((symptom) => (
                      <label key={symptom} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                        <input 
                          type="checkbox" 
                          value={symptom} 
                          checked={selectedSymptoms.includes(symptom)}
                          onChange={() => handleCheckboxChange(symptom)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                        />
                        <span style={{ fontSize: '0.95rem' }}>{symptom}</span>
                      </label>
                    ))}
                  </div>

                  {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

                  <div style={{ textAlign: 'center' }}>
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? 'Processing...' : 'Submit Symptoms'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ textAlign: 'center' }}>
                   {(() => {
                      const style = getResultStyle(triageResult.severity);
                      return (
                        <div style={{
                          background: style.bg,
                          border: `1px solid ${style.border}`,
                          borderRadius: '12px',
                          padding: '24px',
                          marginBottom: '24px'
                        }}>
                          <h3 style={{ color: style.color, fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>
                            {triageResult.severity}
                          </h3>
                          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                            {triageResult.recommendation}
                          </p>
                          {triageResult.alertMedic && (
                            <p style={{ marginTop: '16px', fontWeight: 600, color: style.color }}>
                              ✓ A medic has been notified.
                            </p>
                          )}
                        </div>
                      );
                   })()}
                   <button onClick={() => { setTriageResult(null); setSelectedSymptoms([]); }} className="btn-ghost">
                      Start Over
                   </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
