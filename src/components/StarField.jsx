import React, { useMemo } from 'react';

export default function StarField() {
  const stars = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    dur: Math.random() * 3 + 2,
  })), []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', maxWidth: 430, margin: '0 auto' }}>
      <style>{`
        @keyframes twinkle {
          0%,100%{opacity:0.2;transform:scale(1)}
          50%{opacity:1;transform:scale(1.4)}
        }
      `}</style>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: '#f0e8ff',
          animation: `twinkle ${s.dur}s ${s.delay}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}
