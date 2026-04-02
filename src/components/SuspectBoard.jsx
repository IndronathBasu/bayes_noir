import { argMax } from '../logic/bayesEngine.js';

function ProbabilityBar({ value, color }) {
  const pct = (value * 100).toFixed(1);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className="prob-bar-bg" style={{ flex: 1 }}>
        <div
          className="prob-bar-fill"
          style={{ width: `${value * 100}%`, background: color }}
        />
      </div>
      <span
        className="font-mono"
        style={{
          minWidth: '42px', textAlign: 'right', fontSize: '13px',
          color: value > 0.45 ? '#c9a84c' : '#7a7a6e',
          fontWeight: value > 0.45 ? 'bold' : 'normal',
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

export default function SuspectBoard({ beliefs, prevBeliefs, canAccuse, onAccuse, suspects }) {
  const list = suspects || [];
  const leadingIdx = argMax(beliefs);

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #0e0e18 0%, #0a0a10 100%)',
        border: '1px solid #2a2a3a',
        borderRadius: '4px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '1px solid #2a2a3a', paddingBottom: '10px' }}>
        <span className="font-noir" style={{ color: '#c9a84c', fontSize: '13px', letterSpacing: '2px' }}>
          ◆ SUSPECTS
        </span>
        <div style={{ color: '#4a4a40', fontSize: '10px', marginTop: '4px' }}>
          {canAccuse
            ? '⚖ Click ACCUSE on a suspect to make your accusation'
            : 'Bayesian suspicion distribution'}
        </div>
      </div>

      {/* Suspect cards */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
        {list.map((suspect, i) => {
          const isLeading = i === leadingIdx;
          const belief = beliefs[i];
          const prev = prevBeliefs[i];
          const delta = belief - prev;

          return (
            <div
              key={suspect.id}
              className={`suspect-card ${isLeading ? 'leading' : ''}`}
              style={{ borderRadius: '4px', padding: '12px' }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div
                    style={{
                      fontSize: '28px', lineHeight: 1,
                      filter: isLeading ? 'none' : 'grayscale(0.6) brightness(0.6)',
                      transition: 'filter 0.4s ease',
                    }}
                  >
                    {suspect.emoji}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '13px', fontWeight: 'bold',
                        color: isLeading ? '#c9a84c' : '#d4d4c8',
                        transition: 'color 0.4s ease',
                      }}
                    >
                      {suspect.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#4a4a40', marginTop: '2px' }}>
                      {suspect.role}
                    </div>
                  </div>
                </div>

                {/* Delta badge */}
                {Math.abs(delta) > 0.001 && (
                  <div
                    style={{
                      fontSize: '10px',
                      color: delta > 0 ? '#2ecc71' : '#e74c3c',
                      background: delta > 0 ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                      border: `1px solid ${delta > 0 ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                      padding: '2px 6px', borderRadius: '2px',
                      fontFamily: 'Share Tech Mono, monospace',
                    }}
                  >
                    {delta > 0 ? '+' : ''}{(delta * 100).toFixed(1)}%
                  </div>
                )}
              </div>

              {/* Probability bar */}
              <ProbabilityBar value={belief} color={suspect.barColor} />

              {/* Alibi shown for leading suspect */}
              {isLeading && (
                <div
                  style={{
                    marginTop: '8px', fontSize: '10px', color: '#7a7a6e', fontStyle: 'italic',
                    borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '6px',
                  }}
                >
                  ❝ {suspect.alibi} ❞
                </div>
              )}

              {/* ── ACCUSE BUTTON — appears when player is ready to accuse ── */}
              {canAccuse && (
                <button
                  onClick={() => onAccuse(i)}
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '7px 0',
                    background: isLeading
                      ? 'linear-gradient(135deg, #6b0000, #a02020)'
                      : 'linear-gradient(135deg, #1a1a26, #111118)',
                    border: `1px solid ${isLeading ? '#e74c3c' : '#3a3a4a'}`,
                    color: isLeading ? '#ffffff' : '#7a7a6e',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontFamily: 'Special Elite, cursive',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #8b0000, #c0392b)';
                    e.currentTarget.style.borderColor = '#e74c3c';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(192,57,43,0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isLeading
                      ? 'linear-gradient(135deg, #6b0000, #a02020)'
                      : 'linear-gradient(135deg, #1a1a26, #111118)';
                    e.currentTarget.style.borderColor = isLeading ? '#e74c3c' : '#3a3a4a';
                    e.currentTarget.style.color = isLeading ? '#ffffff' : '#7a7a6e';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ⚖ ACCUSE {suspect.name.toUpperCase()}
                </button>
              )}

              {/* Leading indicator */}
              {isLeading && !canAccuse && (
                <div
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    fontSize: '8px', color: '#c9a84c', letterSpacing: '1px',
                  }}
                >
                  ▶ PRIMARY
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Certainty meter */}
      <div style={{ borderTop: '1px solid #2a2a3a', paddingTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px', color: '#4a4a40' }}>
          <span>Case Certainty</span>
          <span className="font-mono" style={{ color: '#7a7a6e' }}>
            {(Math.max(...beliefs) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="prob-bar-bg">
          <div
            className="prob-bar-fill"
            style={{
              width: `${Math.max(...beliefs) * 100}%`,
              background:
                Math.max(...beliefs) > 0.65
                  ? 'linear-gradient(90deg, #c0392b, #e74c3c)'
                  : Math.max(...beliefs) > 0.45
                  ? 'linear-gradient(90deg, #c9a84c, #e6c97a)'
                  : 'linear-gradient(90deg, #1c2c3c, #2a3a5a)',
            }}
          />
        </div>
        <div style={{ fontSize: '9px', color: '#3a3a3a', marginTop: '4px', textAlign: 'center', letterSpacing: '1px' }}>
          {canAccuse
            ? '⚖ SELECT A SUSPECT TO ACCUSE ABOVE'
            : Math.max(...beliefs) > 0.65
            ? 'HIGH CERTAINTY — READY TO ACCUSE'
            : Math.max(...beliefs) > 0.45
            ? 'BUILDING CASE — GATHER MORE EVIDENCE'
            : 'HIGH UNCERTAINTY — EVIDENCE INCONCLUSIVE'}
        </div>
      </div>
    </div>
  );
}
