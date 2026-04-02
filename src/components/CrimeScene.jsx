/**
 * CrimeScene — Left panel showing the crime scene with clickable clues
 */
import { useState } from 'react';

export default function CrimeScene({ clues, usedClueIds, onClueClick, cluesRemaining }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #0e0e18 0%, #0a0a10 100%)',
        border: '1px solid #2a2a3a',
        borderRadius: '4px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '1px solid #2a2a3a', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            className="font-noir"
            style={{ color: '#c9a84c', fontSize: '13px', letterSpacing: '2px' }}
          >
            ◆ CRIME SCENE
          </span>
          <span
            className="font-mono"
            style={{
              color: cluesRemaining > 0 ? '#c9a84c' : '#c0392b',
              fontSize: '11px',
              background: '#1a1a26',
              padding: '2px 8px',
              border: `1px solid ${cluesRemaining > 0 ? '#c9a84c' : '#c0392b'}`,
              borderRadius: '2px',
            }}
          >
            {cluesRemaining} CLUES LEFT
          </span>
        </div>
        <div
          style={{ color: '#4a4a40', fontSize: '11px', marginTop: '6px', fontStyle: 'italic' }}
        >
          Lord Harrington's Estate — 11:43 PM
        </div>
      </div>

      {/* Scene visual */}
      <div
        className="scanlines"
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg, #0a0a14 0%, #070710 100%)',
          border: '1px solid #1a1a2a',
          borderRadius: '4px',
          height: '140px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Atmospheric scene elements */}
        <div style={{ position: 'absolute', inset: 0, padding: '16px' }}>
          {/* Window with moonlight */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              width: '50px',
              height: '60px',
              border: '2px solid #2a2a3a',
              background: 'linear-gradient(180deg, #1a2030 0%, #0d1525 100%)',
              boxShadow: '0 0 20px rgba(100,120,180,0.15), inset 0 0 10px rgba(100,120,180,0.1)',
            }}
          >
            <div style={{ width: '100%', height: '1px', background: '#2a2a3a', position: 'absolute', top: '50%' }} />
            <div style={{ width: '1px', height: '100%', background: '#2a2a3a', position: 'absolute', left: '50%' }} />
          </div>

          {/* Vault door */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '20px',
              width: '45px',
              height: '55px',
              border: '2px solid #3a3a2a',
              background: 'linear-gradient(135deg, #1a1a10, #0a0a08)',
              borderRadius: '2px',
            }}
          >
            <div
              style={{
                width: '12px', height: '12px',
                border: '1px solid #5a5a3a',
                borderRadius: '50%',
                position: 'absolute',
                right: '6px', top: '50%',
                transform: 'translateY(-50%)',
                background: '#2a2a1a',
              }}
            />
          </div>

          {/* Diamond silhouette */}
          <div
            style={{
              position: 'absolute',
              top: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '24px',
              opacity: 0.15,
              filter: 'grayscale(1)',
            }}
          >
            💎
          </div>

          {/* Crime tape */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '14px',
              background: 'repeating-linear-gradient(90deg, #c9a84c 0px, #c9a84c 30px, #0a0a10 30px, #0a0a10 60px)',
              opacity: 0.5,
            }}
          />

          {/* DO NOT CROSS text */}
          <div
            style={{
              position: 'absolute',
              bottom: '1px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#0a0a10',
              fontSize: '7px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              whiteSpace: 'nowrap',
              zIndex: 2,
            }}
          >
            DO NOT CROSS — DO NOT CROSS — DO NOT CROSS
          </div>
        </div>
      </div>

      {/* Clue buttons */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          className="font-type"
          style={{ color: '#4a4a40', fontSize: '10px', letterSpacing: '1px', marginBottom: '8px' }}
        >
          INVESTIGATE:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {clues.map((clue) => {
            const used = usedClueIds.includes(clue.id);
            const isHovered = hovered === clue.id;

            return (
              <button
                key={clue.id}
                className={`clue-btn ${used ? 'used' : ''}`}
                disabled={used || cluesRemaining === 0}
                onClick={() => !used && onClueClick(clue)}
                onMouseEnter={() => setHovered(clue.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '3px',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{clue.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: used ? '#3a3a3a' : isHovered ? '#c9a84c' : '#d4d4c8',
                          transition: 'color 0.2s',
                        }}
                      >
                        {clue.name}
                      </span>
                      {used && (
                        <span
                          style={{
                            fontSize: '9px',
                            color: '#3a3a3a',
                            background: '#1a1a1a',
                            padding: '1px 5px',
                            borderRadius: '2px',
                            border: '1px solid #2a2a2a',
                          }}
                        >
                          ANALYZED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#4a4a40', marginTop: '2px' }}>
                      📍 {clue.location}
                    </div>
                  </div>
                </div>
                {/* Hover description */}
                {isHovered && !used && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '10px',
                      color: '#7a7a6e',
                      borderTop: '1px solid #2a2a3a',
                      paddingTop: '6px',
                      fontStyle: 'italic',
                    }}
                  >
                    {clue.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
