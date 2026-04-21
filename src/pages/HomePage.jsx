import React, { useState, useRef, useEffect } from 'react';
import { BREEDS, BREED_IMAGE } from '../utils/breeds';
import { getZodiac } from '../utils/zodiac';
import { createProfile, saveProfile, deleteProfile } from '../utils/storage';

const inputStyle = {
  width: '100%', padding: '13px 16px',
  background: '#F8F8F8',
  border: '1.5px solid #EEEEEE',
  borderRadius: 12, color: '#1A1A1A',
  fontSize: 15, fontWeight: 400,
  boxSizing: 'border-box',
};

function formatBirth(birth) {
  if (!birth) return '';
  const [y, m, d] = birth.split('-');
  return `${y.slice(2)}년 ${m}월 ${d}일`;
}

function DogCard({ profile, onClick, onDelete }) {
  const zodiac = getZodiac(profile.birth);
  const imgSrc = profile.profileImages?.[0] || BREED_IMAGE[profile.breed] || '/breeds/default.png';

  return (
    <div onClick={onClick} style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: 'pointer',
      position: 'relative',
      border: '1.5px solid #F0F0F0',
      transition: 'transform 0.15s',
    }}>
      {/* 프로필 이미지 */}
      <div style={{
        width: 68, height: 68, borderRadius: '50%', flexShrink: 0,
        overflow: 'hidden',
        background: '#FFF3B0',
        border: '2.5px solid var(--primary)',
      }}>
        <img src={imgSrc} alt={profile.breed}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* 정보 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>{profile.name}</span>
          {profile.gender && (
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: profile.gender === '남아' ? '#DBEAFE' : '#FCE7F3',
              color: profile.gender === '남아' ? '#2563EB' : '#DB2777',
              borderRadius: 50, padding: '2px 8px',
            }}>{profile.gender}</span>
          )}
          {zodiac && <span style={{ fontSize: 14 }}>{zodiac.emoji}</span>}
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 3 }}>{profile.breed}</div>
        <div style={{ fontSize: 12, color: '#AAA' }}>
          🎂 {formatBirth(profile.birth)}
          {profile.weight && <span style={{ marginLeft: 8 }}>⚖️ {profile.weight}kg</span>}
          {profile.neutered && <span style={{ marginLeft: 8, color: '#7C3AED', fontWeight: 600 }}>✂️ 중성화</span>}
        </div>
      </div>

      {/* 운세 보기 버튼 */}
      <div style={{
        background: 'var(--pink)', color: 'white',
        borderRadius: 50, padding: '8px 14px',
        fontSize: 12, fontWeight: 700, flexShrink: 0,
      }}>
        운세 보기 &gt;
      </div>

      {/* 삭제 */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        style={{
          position: 'absolute', top: 8, right: 8,
          color: '#CCC', fontSize: 14,
        }}
      >✕</button>
    </div>
  );
}

export default function HomePage({ profiles, setProfiles, onSelect, showAddForm, setShowAddForm }) {
  const [form, setForm] = useState({
    name: '', gender: '', breed: '', birth: '',
    weight: '', neutered: false, profileImages: [],
  });
  const [err, setErr] = useState('');
  const fileRef = useRef(null);
  const zodiac = getZodiac(form.birth);

  useEffect(() => {
    if (showAddForm) window.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [showAddForm]);

  const handleImageUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({ ...f, profileImages: [...f.profileImages, ev.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const handleAdd = () => {
    if (!form.name || !form.breed || !form.birth) {
      setErr('이름, 견종, 생년월일은 필수예요!'); return;
    }
    setErr('');
    const p = createProfile({ ...form, personality: '활발하고 에너지 넘침' });
    const updated = saveProfile(p);
    setProfiles(updated);
    setForm({ name: '', gender: '', breed: '', birth: '', weight: '', neutered: false, profileImages: [] });
    setShowAddForm(false);
    onSelect(p);
  };

  return (
    <div style={{ minHeight: '100dvh' }}>

      {/* 상단 헤더 */}
      <div style={{
        background: '#fff',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #F0F0F0',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>
          🐾 독팔자 상팔자
        </div>
        <div style={{ fontSize: 13, color: '#999' }}>
          {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
        </div>
      </div>

      {/* 배너 */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD020 0%, #FFB800 100%)',
        margin: '0',
        padding: '28px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: 20, top: 10, fontSize: 60, opacity: 0.25 }}>🐕</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#8B6800', marginBottom: 6 }}>
          ✨ 오늘의 무료 운세
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>
          우리 강아지 오늘<br />운세는 어떨까? 🔮
        </div>
        <div style={{
          marginTop: 14,
          background: '#fff',
          color: '#FF5FA0',
          borderRadius: 50, padding: '8px 20px',
          fontSize: 14, fontWeight: 700,
          display: 'inline-block',
        }}>
          강아지 운세 보러가기 &gt;
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* 내 강아지 섹션 */}
        {profiles.length > 0 && (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  background: 'var(--primary)', borderRadius: 8,
                  padding: '4px 12px', fontSize: 14, fontWeight: 700,
                }}>🐶 내 강아지</div>
                <span style={{
                  background: 'var(--pink)', color: '#fff',
                  borderRadius: 50, width: 22, height: 22,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>{profiles.length}</span>
              </div>
              <button
                onClick={() => setShowAddForm(f => !f)}
                style={{ fontSize: 13, color: 'var(--pink)', fontWeight: 600 }}
              >+ 추가</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {profiles.map(p => (
                <DogCard
                  key={p.id} profile={p}
                  onClick={() => onSelect(p)}
                  onDelete={() => {
                    const updated = deleteProfile(p.id);
                    setProfiles(updated);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 강아지 없을 때 빈 상태 */}
        {profiles.length === 0 && !showAddForm && (
          <div style={{
            background: '#fff', borderRadius: 20,
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            padding: '40px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🐾</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>
              강아지를 등록해보세요!
            </div>
            <div style={{ fontSize: 14, color: '#999', marginBottom: 24 }}>
              우리 강아지 맞춤 운세를 매일 받아보세요
            </div>
            <button onClick={() => setShowAddForm(true)} style={{
              background: 'var(--primary)', color: '#1A1A1A',
              borderRadius: 50, padding: '14px 32px',
              fontSize: 16, fontWeight: 700,
              boxShadow: '0 4px 16px rgba(255,208,32,0.4)',
            }}>
              🐶 내 강아지 추가하기
            </button>
          </div>
        )}

        {/* 추가 버튼 (프로필 있을 때) */}
        {profiles.length > 0 && !showAddForm && (
          <button onClick={() => setShowAddForm(true)} style={{
            width: '100%', padding: '14px',
            background: '#fff',
            border: '2px dashed #FFD020',
            borderRadius: 16, color: '#888',
            fontSize: 15, fontWeight: 500,
          }}>
            + 내 강아지 추가
          </button>
        )}

        {/* 추가 폼 */}
        {showAddForm && (
          <div style={{
            background: '#fff', borderRadius: 20,
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}>
            {/* 폼 헤더 */}
            <div style={{
              background: 'var(--primary)', padding: '14px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>🐶 내 강아지 추가</span>
              <button onClick={() => setShowAddForm(false)} style={{ fontSize: 20, color: '#666' }}>✕</button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* 필수 안내 */}
              <div style={{
                background: '#FFF3B0', borderRadius: 10,
                padding: '10px 14px', fontSize: 13, color: '#8B6800',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                ✏️ <span>이름, 견종, 생년월일은 <strong>필수</strong>예요</span>
              </div>

              {/* 이름 + 성별 */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text" placeholder="강아지 이름 *" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <select
                  value={form.gender}
                  onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                  style={{ ...inputStyle, width: 86, flex: 'none', appearance: 'none', textAlign: 'center' }}
                >
                  <option value="">성별</option>
                  <option value="남아">남아 🐾</option>
                  <option value="여아">여아 🎀</option>
                </select>
              </div>

              {/* 견종 */}
              <select
                value={form.breed}
                onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value="">견종 선택 *</option>
                {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              {/* 생년월일 */}
              <div>
                <input
                  type="date" value={form.birth}
                  onChange={e => setForm(f => ({ ...f, birth: e.target.value }))}
                  style={{ ...inputStyle, colorScheme: 'light' }}
                />
                {zodiac && (
                  <div style={{
                    marginTop: 8, padding: '8px 14px',
                    background: '#F3EEFF', borderRadius: 10,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ fontSize: 16 }}>{zodiac.emoji}</span>
                    <span style={{ fontSize: 13, color: '#7C3AED', fontWeight: 500 }}>{zodiac.name} · {zodiac.trait}</span>
                  </div>
                )}
              </div>

              {/* 구분선 */}
              <div style={{ borderTop: '1.5px dashed #EEE', margin: '4px 0' }} />
              <div style={{ fontSize: 12, color: '#AAA', fontWeight: 500 }}>선택 정보</div>

              {/* 프로필 사진 */}
              <div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', color: '#999' }}
                >
                  📷 프로필 사진 추가 (여러 장 가능)
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple
                  style={{ display: 'none' }} onChange={handleImageUpload} />
                {form.profileImages.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {form.profileImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={img} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: '2px solid var(--primary)' }} />
                        <button
                          onClick={() => setForm(f => ({ ...f, profileImages: f.profileImages.filter((_, i) => i !== idx) }))}
                          style={{
                            position: 'absolute', top: -6, right: -6,
                            background: '#FF5FA0', color: 'white', borderRadius: '50%',
                            width: 18, height: 18, fontSize: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 몸무게 */}
              <input
                type="number" placeholder="몸무게 (kg)" value={form.weight}
                onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                style={inputStyle} min="0" step="0.1"
              />

              {/* 중성화 토글 */}
              <div
                onClick={() => setForm(f => ({ ...f, neutered: !f.neutered }))}
                style={{
                  ...inputStyle, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <span style={{ color: '#555' }}>✂️ 중성화 여부</span>
                <div style={{
                  width: 46, height: 26, borderRadius: 13,
                  background: form.neutered ? '#7C3AED' : '#DDD',
                  position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 3,
                    left: form.neutered ? 23 : 3,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }} />
                </div>
              </div>

              {err && (
                <div style={{ background: '#FFF0F0', borderRadius: 10, padding: '10px 14px', color: '#FF4444', fontSize: 13, fontWeight: 500 }}>
                  ⚠️ {err}
                </div>
              )}

              {/* 저장 버튼 */}
              <button onClick={handleAdd} style={{
                width: '100%', padding: '16px',
                background: 'var(--pink)',
                borderRadius: 14, color: '#fff',
                fontSize: 17, fontWeight: 700,
                boxShadow: '0 4px 16px rgba(255,95,160,0.35)',
                marginTop: 4,
              }}>
                저장하기 🐾
              </button>
            </div>
          </div>
        )}

        {/* 하단 여백 */}
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
