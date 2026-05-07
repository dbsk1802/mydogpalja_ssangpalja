import React, { useEffect, useState } from 'react';

export default function ScoreMeter({ label, score, text, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{
      background: '#F8F8F8',
      border: '1.5px solid #EEEEEE',
      borderRadius: 14,
      padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 800, color }}>{score}</span>
      </div>
      <div style={{ height: 7, borderRadius: 4, background: '#E5E5E5', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4,
          background: color,
          width: `${width}%`,
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <p style={{ fontSize: 11, color: '#888', marginTop: 5, fontWeight: 400 }}>{text}</p>
    </div>
  );
}
