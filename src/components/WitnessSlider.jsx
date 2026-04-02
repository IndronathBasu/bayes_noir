/**
 * WitnessSlider — Fuzzy logic input panel
 */
import { useState, useEffect } from 'react';
import { witnessToLikelihoods, describeFuzzyValue } from '../logic/fuzzyLogic.js';

export default function WitnessSlider({ onApply, disabled, suspects, witnessContext }) {
  const [value, setValue] = useState(0.5);
  const [applied, setApplied] = useState(false);

  const likelihoods = witnessToLikelihoods(value);
  const description = describeFuzzyValue(value);

  const pct = Math.round(value * 100);

  function handleApply() {
    onApply(likelihoods, value);
    setApplied(true);
  }

  // Update CSS variable for slider gradient
  const sliderStyle = {
    '--slider-pct': `${pct}%`,
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0d0d18, #0a0a12)',
        border: '1px solid #1a2a3a',
        borderLeft: '3px solid #c9a84c',
        borderRadius: '4px',
        padding: '14px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <div>
          <span
            className="font-noir"
            style={{ color: '#c9a84c', fontSize: '11px', letterSpacing: '2px' }}
          >
            👁 WITNESS STATEMENT
          </span>
          <div style={{ fontSize: '10px', color: '#4a4a40', marginTop: '2px' }}>
            Fuzzy logic — imprecise description
          </div>
        </div>
        {applied && (
          <span
            style={{
              fontSize: '9px',
              color: '#27ae60',
              border: '1px solid rgba(39,174,96,0.3)',
              padding: '2px 6px',
              borderRadius: '2px',
            }}
          >
            ✓ APPLIED
          </span>
        )}
      </div>

      {/* Quote */}
      <div
        style={{
          fontSize: '12px',
          color: '#7a7a6e',
          fontStyle: 'italic',
          marginBottom: '12px',
          borderLeft: '2px solid #2a2a3a',
          paddingLeft: '10px',
        }}
      >
        "The figure I saw <span style={{ color:'#7a9aaa', fontStyle:'normal' }}>{witnessContext || 'nearby'}</span>… they were{' '}
        <span style={{ color: '#c9a84c', fontStyle: 'normal' }}>{description}</span>."
      </div>

      {/* Slider */}
      <div style={{ marginBottom: '10px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '9px',
            color: '#3a3a3a',
            marginBottom: '6px',
          }}
        >
          <span>SHORT</span>
          <span style={{ color: '#c9a84c' }}>{pct}%</span>
          <span>TALL</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => {
            setValue(parseFloat(e.target.value));
            setApplied(false);
          }}
          className="noir-slider"
          style={sliderStyle}
          disabled={disabled}
        />
      </div>

      {/* Fuzzy memberships */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        {(suspects || []).map((s, i) => (
          <div
            key={s.id || i}
            style={{
              flex: 1,
              background: '#0a0a14',
              border: '1px solid #1a1a2a',
              borderRadius: '3px',
              padding: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9px', color: '#4a4a40', marginBottom: '3px' }}>
              {s.name?.split(' ')[0] || s.name}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '12px',
                color: likelihoods[i] > 0.6 ? '#c9a84c' : '#7a7a6e',
              }}
            >
              {(likelihoods[i] * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      {/* Apply button */}
      <button
        onClick={handleApply}
        disabled={disabled || applied}
        style={{
          width: '100%',
          padding: '8px',
          background: disabled || applied ? '#1a1a26' : 'linear-gradient(135deg, #1a2a1a, #0d1a0d)',
          border: `1px solid ${applied ? '#27ae60' : '#2a3a2a'}`,
          color: applied ? '#27ae60' : '#2ecc71',
          borderRadius: '3px',
          cursor: disabled || applied ? 'not-allowed' : 'pointer',
          fontSize: '11px',
          letterSpacing: '1px',
          fontFamily: 'Courier Prime, monospace',
          transition: 'all 0.2s',
          opacity: disabled ? 0.4 : 1,
        }}
      >
        {applied ? '✓ WITNESS TESTIMONY LOGGED' : '⟶ APPLY WITNESS TESTIMONY'}
      </button>
    </div>
  );
}
