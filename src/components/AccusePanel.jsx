import { argMax, maxBelief } from '../logic/bayesEngine.js';

export default function AccusePanel({ beliefs, cluesUsed, onReset, canAccuse, suspects }) {
  const list = suspects || [];
  const leadingIdx = argMax(beliefs);
  const leading = list[leadingIdx] || { emoji:'?', name:'Unknown' };
  const confidence = maxBelief(beliefs);
  const sorted = [...beliefs].sort((a, b) => b - a);
  const veryUncertain = (sorted[0] - sorted[2]) < 0.10;

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>

      {/* Instruction / status block */}
      <div
        style={{
          flex: 1, minWidth: '220px',
          background: canAccuse ? '#0a0308' : '#08080f',
          border: `1px solid ${canAccuse ? '#8b0000' : '#1a1a2a'}`,
          borderRadius: '4px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div style={{ fontSize: '26px', flexShrink: 0 }}>
          {canAccuse ? '⚖' : '🔍'}
        </div>
        <div>
          {canAccuse ? (
            <>
              <div style={{ fontSize: '11px', color: '#c0392b', letterSpacing: '1px', marginBottom: '2px' }}>
                ACCUSATION PHASE
              </div>
              <div style={{ fontSize: '12px', color: '#d4d4c8' }}>
                Select a suspect on the right panel to accuse them
              </div>
              {veryUncertain && (
                <div style={{ fontSize: '10px', color: '#e67e22', marginTop: '3px' }}>
                  ⚠ Beliefs are very close — this is a risky accusation
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ fontSize: '11px', color: '#4a4a40', letterSpacing: '1px', marginBottom: '2px' }}>
                INVESTIGATION IN PROGRESS
              </div>
              <div style={{ fontSize: '12px', color: '#7a7a6e' }}>
                Collect at least 1 clue to enable accusation
              </div>
            </>
          )}
        </div>
      </div>

      {/* Leading suspect quick-view */}
      {canAccuse && (
        <div
          style={{
            background: '#0a0008', border: '1px solid #2a1520',
            borderRadius: '4px', padding: '8px 14px',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px' }}>{leading.emoji}</div>
            <div style={{ fontSize: '9px', color: '#4a4a40' }}>
              {(confidence * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '9px', color: '#4a4a40', letterSpacing: '1px' }}>
              HIGHEST BELIEF:
            </div>
            <div style={{ fontSize: '12px', color: '#c9a84c', fontWeight: 'bold' }}>
              {leading.name}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: '#3a3a3a', letterSpacing: '1px' }}>CLUES</div>
          <div className="font-mono" style={{ fontSize: '18px', color: '#7a7a6e', lineHeight: 1 }}>
            {cluesUsed}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: '#3a3a3a', letterSpacing: '1px' }}>SCORE EST.</div>
          <div className="font-mono" style={{ fontSize: '18px', color: '#c9a84c', lineHeight: 1 }}>
            ~{Math.max(0, Math.round(confidence * 100 - cluesUsed * 10))}
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        className="btn-reset"
        onClick={onReset}
        style={{ padding: '10px 16px', fontSize: '11px', borderRadius: '4px', letterSpacing: '1px', flexShrink: 0 }}
      >
        ↺ RESET
      </button>
    </div>
  );
}
