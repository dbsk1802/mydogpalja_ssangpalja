import React from 'react';
import { BREED_IMAGE } from '../utils/breeds';
import { getZodiac } from '../utils/zodiac';

export default function ProfileChip({ profile, active, onClick, onDelete }) {
  const zodiac = getZodiac(profile.birth);
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px',
      borderRadius: 24,
      background: active ? 'rgba(139,111,212,0.3)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${active ? 'rgba(139,111,212,0.8)' : 'rgba(255,255,255,0.12)'}`,
      cursor: 'pointer',
      transition: 'all 0.2s',
      flexShrink: 0,
      boxShadow: active ? '0 0 16px rgba(139,111,212,0.4)' : 'none',
    }}>
      <img src={BREED_IMAGE[profile.breed] || '/breeds/default.png'} alt={profile.breed}
        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'contain' }} />
      <span style={{ fontSize: 14, fontWeight: active ? 500 : 300, color: active ? '#c4b0f5' : 'rgba(240,232,255,0.8)', whiteSpace: 'nowrap' }}>
        {profile.name}
      </span>
      {zodiac && <span style={{ fontSize: 12 }}>{zodiac.emoji}</span>}
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        style={{
          background: 'none', color: 'rgba(240,232,255,0.35)',
          fontSize: 11, padding: '0 2px', lineHeight: 1,
          transition: 'color 0.2s',
        }}
      >✕</button>
    </div>
  );
}
