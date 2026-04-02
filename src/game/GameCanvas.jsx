/**
 * BAYES NOIR — GameCanvas (Minecraft Edition)
 * Uses mcRenderer.js with per-case hotspots and 3 distinct scenes.
 */
import { useRef, useEffect, useCallback, useState } from 'react';
import { drawFrame, drawIntroFrame, drawHoverLabelMC } from './mcRenderer.js';

const LOGICAL_W = 320;
const LOGICAL_H = 220;

export default function GameCanvas({
  usedClueIds, onClueClick, cluesRemaining,
  gamePhase, onStartGame, caseData,
}) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const animRef      = useRef(null);
  const stateRef     = useRef({
    hoveredId: null, time: 0, usedClueIds: [],
    scaleX: 1, scaleY: 1, scale: 1, caseIndex: 0,
  });
  const [, forceUpdate] = useState(0);

  stateRef.current.usedClueIds = usedClueIds;
  stateRef.current.caseIndex   = caseData?.id ?? 0;
  const hotspots = caseData?.hotspots || [];

  // ── Resize ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      const canvas    = canvasRef.current;
      if (!container || !canvas) return;
      const cw = container.clientWidth  || 600;
      const ch = container.clientHeight || 400;
      canvas.width  = cw; canvas.height = ch;
      canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
      stateRef.current.scaleX = cw / LOGICAL_W;
      stateRef.current.scaleY = ch / LOGICAL_H;
      stateRef.current.scale  = cw / LOGICAL_W;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Game loop ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { scaleX: SX, scaleY: SY, scale, time, hoveredId, caseIndex } = stateRef.current;
      stateRef.current.time++;

      if (gamePhase === 'intro') {
        drawIntroFrame(ctx, canvas.width, canvas.height, time, caseData || { icon: '🔍', title: 'Bayes Noir', subtitle: '' });
      } else {
        drawFrame(ctx, canvas.width, canvas.height, SX, SY, {
          hoveredId, time, usedClueIds: stateRef.current.usedClueIds, caseIndex,
        });
        // Draw hover label separately (needs hotspot data)
        if (hoveredId) {
          const spot = hotspots.find(h => h.id === hoveredId);
          if (spot && !stateRef.current.usedClueIds.includes(spot.clue)) {
            drawHoverLabelMC(ctx, SX, SY, spot, time);
          }
        }
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [gamePhase, caseData]);

  // ── Mouse move ───────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const sx = stateRef.current.scaleX, sy = stateRef.current.scaleY;
    const lx = mx / sx, ly = my / sy;
    const hit = hotspots.find(h => lx >= h.x && lx <= h.x + h.w && ly >= h.y && ly <= h.y + h.h) || null;
    const id  = hit ? hit.id : null;
    const alreadyUsed = stateRef.current.usedClueIds.includes(hit?.clue);
    stateRef.current.hoveredId = (id && !alreadyUsed) ? id : null;
    canvas.style.cursor = (stateRef.current.hoveredId && cluesRemaining > 0) ? 'pointer' : 'default';
  }, [hotspots, cluesRemaining]);

  // ── Click ────────────────────────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (gamePhase === 'intro') { onStartGame(); return; }
    const hovId = stateRef.current.hoveredId;
    if (!hovId || cluesRemaining <= 0) return;
    const spot = hotspots.find(h => h.id === hovId);
    if (!spot || stateRef.current.usedClueIds.includes(spot.clue)) return;
    onClueClick({ id: spot.clue });
  }, [gamePhase, onStartGame, hotspots, cluesRemaining, onClueClick]);

  return (
    <div ref={containerRef} style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#05050a', display: 'flex',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={() => { stateRef.current.hoveredId = null; }}
        style={{ imageRendering: 'pixelated', display: 'block' }}
      />

      {/* Minecraft-style HUD overlays */}
      {gamePhase === 'playing' && (
        <>
          {/* Clue inventory */}
          <div style={{
            position: 'absolute', top: 8, right: 8,
            display: 'flex', gap: 4,
          }}>
            {Array.from({ length: cluesRemaining + (4 - cluesRemaining) }).map((_, i) => (
              <div key={i} style={{
                width: 22, height: 22,
                background: i < cluesRemaining ? '#373737' : '#1a1a18',
                border: '2px solid',
                borderColor: i < cluesRemaining
                  ? '#ffffff #5a5a5a #5a5a5a #ffffff'
                  : '#3a3a38 #1a1a18 #1a1a18 #3a3a38',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
              }}>
                {i < cluesRemaining ? '🔍' : ''}
              </div>
            ))}
          </div>

          {/* No clues left warning */}
          {cluesRemaining === 0 && (
            <div style={{
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
              background: '#0a0a18',
              border: '3px solid', borderColor: '#c0392b #6a1a0a #6a1a0a #c0392b',
              padding: '6px 16px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8, color: '#e74c3c', letterSpacing: 1, whiteSpace: 'nowrap',
            }}>
              ⚠ ACCUSE A SUSPECT →
            </div>
          )}
        </>
      )}
    </div>
  );
}
