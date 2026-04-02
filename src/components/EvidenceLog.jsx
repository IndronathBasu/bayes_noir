/**
 * EvidenceLog — Bottom scrolling log of all actions taken
 */
import { useRef, useEffect } from 'react';

export default function EvidenceLog({ entries }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries]);

  return (
    <div
      style={{
        background: '#080810',
        border: '1px solid #1a1a2a',
        borderRadius: '4px',
        padding: '10px 14px',
        maxHeight: '90px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <div
        className="font-mono"
        style={{
          color: '#2a2a3a',
          fontSize: '9px',
          letterSpacing: '1px',
          borderBottom: '1px solid #1a1a2a',
          paddingBottom: '4px',
          marginBottom: '4px',
        }}
      >
        DETECTIVE'S LOG ──────────────────────────────
      </div>
      {entries.length === 0 ? (
        <div style={{ color: '#2a2a3a', fontSize: '10px', fontStyle: 'italic' }}>
          No evidence analyzed yet. Click a clue to begin.
        </div>
      ) : (
        entries.map((entry, i) => (
          <div
            key={i}
            className="log-entry"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '10px',
            }}
          >
            <span className="font-mono" style={{ color: '#2a2a3a', flexShrink: 0, fontSize: '9px' }}>
              [{String(i + 1).padStart(2, '0')}]
            </span>
            <span style={{ color: entry.type === 'warn' ? '#e67e22' : '#7a7a6e' }}>
              {entry.type === 'clue' && (
                <span style={{ color: '#c9a84c' }}>{entry.icon} {entry.clue}: </span>
              )}
              {entry.type === 'fuzzy' && (
                <span style={{ color: '#27ae60' }}>👁 WITNESS: </span>
              )}
              {entry.type === 'system' && (
                <span style={{ color: '#3498db' }}>◆ SYSTEM: </span>
              )}
              {entry.text}
            </span>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
