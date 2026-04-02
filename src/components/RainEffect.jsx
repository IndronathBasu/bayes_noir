/**
 * RainEffect — Atmospheric background rain animation
 */
import { useMemo } from 'react';

export default function RainEffect() {
  const drops = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      height: 40 + Math.random() * 80,
      duration: 0.8 + Math.random() * 1.4,
      delay: Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {drops.map((d) => (
        <div
          key={d.id}
          className="rain-drop"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}
