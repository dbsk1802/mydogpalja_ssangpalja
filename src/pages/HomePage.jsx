import React, { useState } from 'react';
import ProfileChip from '../components/ProfileChip';
import { BREEDS, BREED_EMOJI, PERSONALITIES } from '../utils/breeds';
import { getZodiac } from '../utils/zodiac';
import { createProfile, saveProfile, deleteProfile } from '../utils/storage';

const inputStyle = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12, color: '#f0e8ff',
  fontSize: 15, fontWeight: 300,
};

export default function HomePage({ profiles, setProfiles, onSelect }) {
  const [showForm, setShowForm] = useState(profiles.length === 0);
  const [form, setForm] = useState({ name: '', breed: '', birth: '', personality: '' });
  const [err, setErr] = useState('');

  const zodiac = getZodiac(form.birth);

  const handleAdd = () => {
    if (!form.name || !form.breed || !form.birth || !form.personality) {
      setErr('모든 항목을 입력해 주세요!'); return;
    }
    setErr('');
    const p = createProfile(form);
    const updated = saveProfile(p);
    setProfiles(updated);
    setForm({ name: '', breed: '', birth: '', personality: '' });
    setShowForm(false);
    onSelect(p);
  };

  const handleDelete = (id) => {
    const updated = deleteProfile(id);
    setProfiles(updated);
  };

  return (
    <div style={{ padding: '0 20px 40px', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🌙</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#c4b0f5', fontWeight: 700, lineHeight: 1.2 }}>
          강아지 오늘의 운세
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(196,176,245,0.6)', marginTop: 6, fontWeight: 300 }}>
          {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
      </div>

      {/* Saved profiles */}
      {profiles.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'rgba(196,176,245,0.5)', marginBottom: 12, fontWeight: 300 }}>저장된 강아지</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {profiles.map(p => (
              <ProfileChip
                key={p.id} profile={p} active={false}
                onClick={() => onSelect(p)}
                onDelete={() => handleDelete(p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{
          width: '100%', padding: '14px',
          background: 'rgba(139,111,212,0.2)',
          border: '1px dashed rgba(139,111,212,0.5)',
          borderRadius: 16, color: '#c4b0f5',
          fontSize: 15, fontWeight: 400,
          marginBottom: 16,
        }}>
          + 새 강아지 추가
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: '20px',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontWeight: 500, fontSize: 16, color: '#c4b0f5' }}>새 강아지 프로필</p>
            {profiles.length > 0 && (
              <button onClick={() => setShowForm(false)} style={{ background: 'none', color: 'rgba(196,176,245,0.5)', fontSize: 20 }}>✕</button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text" placeholder="이름 (예: 콩이)" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inputStyle}
            />

            <select
              value={form.breed}
              onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              <option value="">견종 선택</option>
              {BREEDS.map(b => <option key={b} value={b}>{BREED_EMOJI[b]} {b}</option>)}
            </select>

            <div>
              <input
                type="date" value={form.birth}
                onChange={e => setForm(f => ({ ...f, birth: e.target.value }))}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
              {zodiac && (
                <div style={{
                  marginTop: 6, padding: '6px 12px',
                  background: 'rgba(139,111,212,0.15)',
                  borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 16 }}>{zodiac.emoji}</span>
                  <span style={{ fontSize: 13, color: '#c4b0f5' }}>{zodiac.name} · {zodiac.trait}</span>
                </div>
              )}
            </div>

            <select
              value={form.personality}
              onChange={e => setForm(f => ({ ...f, personality: e.target.value }))}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              <option value="">성격 선택</option>
              {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {err && <p style={{ color: '#ff8fab', fontSize: 13, marginTop: 8 }}>{err}</p>}

          <button onClick={handleAdd} style={{
            width: '100%', marginTop: 16,
            padding: '16px',
            background: 'linear-gradient(135deg, #4a2fa0, #8b6fd4)',
            borderRadius: 14, color: '#f0e8ff',
            fontSize: 16, fontWeight: 500,
            boxShadow: '0 4px 20px rgba(139,111,212,0.4)',
          }}>
            ✨ 운세 보기
          </button>
        </div>
      )}
    </div>
  );
}
