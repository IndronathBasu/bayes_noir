/**
 * IntroScreen — Cinematic noir intro before the game starts
 */
import { useState, useEffect } from 'react';
import { CASE_TITLE, CASE_INTRO, SUSPECTS, PRIORS } from '../data/caseData.js';

export default function IntroScreen({ onStart }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    if (lineIndex < CASE_INTRO.length) {
      const t = setTimeout(() => setLineIndex((i) => i + 1), 1600);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowStart(true), 500);
      return () => clearTimeout(t);
    }
  }, [lineIndex]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, #0d0d18 0%, #050508 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        padding: '40px',
      }}
    >
      {/* Top title */}
      <div className="fade-slide-down" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          className="font-noir glow-gold flicker"
          style={{ fontSize: '11px', letterSpacing: '6px', color: '#c9a84c', marginBottom: '12px' }}
        >
          ◆ ◆ ◆ &nbsp; BAYES NOIR &nbsp; ◆ ◆ ◆
        </div>
        <h1
          className="font-noir glow-gold"
          style={{ fontSize: 'clamp(28px, 5vw, 54px)', color: '#e6c97a', marginBottom: '8px', lineHeight: 1.1 }}
        >
          The Uncertain Case
        </h1>
        <div style={{ color: '#4a4a40', fontSize: '13px', letterSpacing: '2px' }}>
          Case File: {CASE_TITLE}
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          width: '240px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
          marginBottom: '32px',
        }}
      />

      {/* Intro lines */}
      <div
        style={{
          maxWidth: '540px',
          width: '100%',
          minHeight: '120px',
          marginBottom: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {CASE_INTRO.slice(0, lineIndex).map((line, i) => (
          <p
            key={i}
            className="fade-in"
            style={{
              color: i === lineIndex - 1 ? '#d4d4c8' : '#5a5a50',
              fontSize: '13px',
              lineHeight: 1.7,
              textAlign: 'center',
              fontStyle: 'italic',
              transition: 'color 0.5s',
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Suspects preview */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '36px' }}>
        {SUSPECTS.map((s, i) => (
          <div
            key={s.id}
            className="fade-in"
            style={{
              textAlign: 'center',
              opacity: lineIndex >= 3 ? 1 : 0,
              transition: `opacity 0.6s ease ${i * 0.2}s`,
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                border: '1px solid #2a2a3a',
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #1a1a26, #0a0a10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '6px',
                filter: 'grayscale(0.4)',
              }}
            >
              {s.emoji}
            </div>
            <div style={{ fontSize: '9px', color: '#4a4a40', letterSpacing: '1px' }}>
              P₀ = {(PRIORS[i] * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      {/* Diamond icon */}
      <div style={{ fontSize: '40px', marginBottom: '32px', opacity: 0.4 }}>💎</div>

      {/* Start button */}
      {showStart && (
        <button
          className="btn-accuse reveal-in pulse-gold"
          onClick={onStart}
          style={{
            padding: '14px 48px',
            fontSize: '14px',
            letterSpacing: '3px',
            borderRadius: '4px',
          }}
        >
          BEGIN INVESTIGATION
        </button>
      )}

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          fontSize: '9px',
          color: '#2a2a3a',
          letterSpacing: '1px',
          textAlign: 'center',
        }}
      >
        BAYESIAN INFERENCE ENGINE • FUZZY LOGIC SYSTEM • UNCERTAINTY MODELING
      </div>
    </div>
  );
}
