import React, { useEffect, useRef, useState } from 'react';

export default function ScoreMeter({ label, score, text, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'rgba(240,232,255,0.6)', fontWeight: 300 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color }}>{score}점</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3,
          background: color,
          width: `${width}%`,
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 8px ${color}88`,
        }} />
      </div>
      <p style={{ fontSize: 12, color: 'rgba(240,232,255,0.5)', marginTop: 5, fontWeight: 300 }}>{text}</p>
    </div>
  );
}
