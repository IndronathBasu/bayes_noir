/**
 * BayesBot — XAI Explanation Panel
 * Shows natural language reasoning after each belief update.
 */
import { useEffect, useRef, useState } from 'react';

export default function BayesBot({ lines, isLoading }) {
  const scrollRef = useRef(null);
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    if (!lines || lines.length === 0) {
      setVisibleLines([]);
      return;
    }

    // Stagger line reveals
    setVisibleLines([]);
    lines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, i * 180);
    });
  }, [lines]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div
      className="bayes-bot"
      style={{
        borderRadius: '4px',
        padding: '14px',
        minHeight: '100px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          borderBottom: '1px solid #1a3a5c',
          paddingBottom: '8px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a3a5c, #0d2540)',
            border: '1px solid #2980b9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            flexShrink: 0,
          }}
        >
          🤖
        </div>
        <div>
          <div
            className="font-noir"
            style={{ color: '#3498db', fontSize: '11px', letterSpacing: '2px' }}
          >
            BAYES-BOT
          </div>
          <div style={{ fontSize: '9px', color: '#1a3a5c' }}>
            Probabilistic Analysis Engine v2.4
          </div>
        </div>

        {isLoading && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '3px' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#3498db',
                  animation: `blink 1s step-end infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lines */}
      <div
        ref={scrollRef}
        style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}
      >
        {visibleLines.length === 0 && !isLoading ? (
          <div style={{ color: '#1a3a5c', fontSize: '11px', fontStyle: 'italic' }}>
            Investigate a clue or apply witness testimony to begin analysis…
          </div>
        ) : (
          visibleLines.map((line, i) => (
            <div
              key={i}
              className="log-entry"
              style={{
                fontSize: '11px',
                color: line.startsWith('⚠️')
                  ? '#e67e22'
                  : line.startsWith('Analyzing')
                  ? '#c9a84c'
                  : '#7ab0d0',
                lineHeight: 1.5,
                paddingLeft: line.startsWith('⚠️') || line.startsWith('Analyzing') ? '0' : '8px',
                borderLeft:
                  line.startsWith('This clue') ? '2px solid #1a3a5c' : 'none',
              }}
            >
              {i === visibleLines.length - 1 && visibleLines.length === lines.length ? (
                <span className="cursor">{line}</span>
              ) : (
                line
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
