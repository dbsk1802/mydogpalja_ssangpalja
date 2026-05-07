import React, { useState, useRef, useEffect } from 'react';
import { BREEDS, BREED_IMAGE } from '../utils/breeds';
import { getZodiac } from '../utils/zodiac';
import { createProfile, saveProfile, deleteProfile } from '../utils/storage';

const ZODIAC_ELEMENT = {
  '양자리': 'fire', '사자자리': 'fire', '사수자리': 'fire',
  '황소자리': 'earth', '처녀자리': 'earth', '염소자리': 'earth',
  '쌍둥이자리': 'air', '천칭자리': 'air', '물병자리': 'air',
  '게자리': 'water', '전갈자리': 'water', '물고기자리': 'water',
};
const ELEMENT_COMPAT = {
  fire:  { fire: 85, air: 80, earth: 45, water: 40 },
  earth: { earth: 85, water: 80, fire: 45, air: 50 },
  air:   { air: 85, fire: 80, earth: 50, water: 45 },
  water: { water: 85, earth: 80, air: 45, fire: 40 },
};
function getCompat(z1, z2) {
  const e1 = ZODIAC_ELEMENT[z1?.name] || 'fire';
  const e2 = ZODIAC_ELEMENT[z2?.name] || 'fire';
  return ELEMENT_COMPAT[e1]?.[e2] ?? 60;
}
function compatLabel(score) {
  if (score >= 80) return { text: '천생연분 💕', color: '#FF5FA0' };
  if (score >= 65) return { text: '좋은 친구 🐾', color: '#FF9500' };
  if (score >= 50) return { text: '무난해요 😊', color: '#7C3AED' };
  return { text: '개성 강해요 🤔', color: '#888' };
}

const SHOP_ITEMS = {
  popular: [
    { emoji: '🦴', name: '수제 닭가슴살 트릿', desc: '단백질 풍부, 저지방', tag: '인기 1위' },
    { emoji: '🎾', name: '소리나는 공 장난감', desc: '치아 건강 & 스트레스 해소', tag: '베스트셀러' },
    { emoji: '🛁', name: '순한 강아지 샴푸', desc: '피부 자극 없는 천연 성분', tag: '재구매율 94%' },
  ],
  lucky: [
    { emoji: '⭐', name: '황금 별 목걸이', desc: '행운을 부르는 아이템', tag: '행운 아이템' },
    { emoji: '🌈', name: '무지개 리드줄', desc: '오늘 산책에 행운을!', tag: '오늘의 추천' },
    { emoji: '🍀', name: '클로버 패턴 담요', desc: '행운 가득한 낮잠 타임', tag: 'Lucky' },
  ],
  health: [
    { emoji: '💊', name: '관절 영양제', desc: '글루코사민 & 콘드로이틴', tag: '수의사 추천' },
    { emoji: '🦷', name: '덴탈 껌', desc: '치석 제거 & 구취 케어', tag: '매일 필수' },
    { emoji: '🐟', name: '오메가3 오일', desc: '피모 건강 & 두뇌 발달', tag: '건강 필수' },
  ],
};

const inputStyle = {
  width: '100%', padding: '13px 16px',
  background: '#F8F8F8', border: '1.5px solid #EEEEEE',
  borderRadius: 12, color: '#1A1A1A', fontSize: 15,
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
      background: '#fff', borderRadius: 16,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: 'pointer', position: 'relative',
      border: '1.5px solid #F0F0F0',
    }}>
      <div style={{
        width: 68, height: 68, borderRadius: '50%', flexShrink: 0,
        overflow: 'hidden', background: '#FFF3B0',
        border: '2.5px solid var(--primary)',
      }}>
        <img src={imgSrc} alt={profile.breed}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>{profile.name}</span>
          {profile.gender && (
            <span style={{
              fontSize: 11, fontWeight: 600, borderRadius: 50, padding: '2px 8px',
              background: profile.gender === '남아' ? '#DBEAFE' : '#FCE7F3',
              color: profile.gender === '남아' ? '#2563EB' : '#DB2777',
            }}>{profile.gender}</span>
          )}
          {zodiac && <span style={{ fontSize: 14 }}>{zodiac.emoji}</span>}
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 2 }}>{profile.breed}</div>
        <div style={{ fontSize: 12, color: '#AAA' }}>
          🎂 {formatBirth(profile.birth)}
          {profile.weight && <span style={{ marginLeft: 8 }}>⚖️ {profile.weight}kg</span>}
          {profile.neutered && <span style={{ marginLeft: 8, color: '#7C3AED', fontWeight: 600 }}>✂️ 중성화</span>}
        </div>
      </div>
      <div style={{ background: 'var(--pink)', color: '#fff', borderRadius: 50, padding: '8px 14px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
        운세 보기 &gt;
      </div>
      <button onClick={e => { e.stopPropagation(); onDelete(); }}
        style={{ position: 'absolute', top: 8, right: 8, color: '#CCC', fontSize: 14 }}>✕</button>
    </div>
  );
}

function ShopTab() {
  const [tab, setTab] = useState('popular');
  const tabs = [
    { key: 'popular', label: '🔥 인기 아이템' },
    { key: 'lucky', label: '✨ 행운 아이템' },
    { key: 'health', label: '💊 건강 아이템' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 안내 배너 */}
      <div style={{ background: '#FFF3B0', borderRadius: 14, padding: '12px 16px', fontSize: 13, color: '#8B6800', lineHeight: 1.6 }}>
        🛍️ <strong>다른 반려견 주인들이 많이 찾는</strong> 아이템과 운세 기반 행운 아이템을 추천해드려요!
      </div>

      {/* 서브탭 */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 600,
            background: tab === t.key ? 'var(--primary)' : '#F0F0F0',
            color: tab === t.key ? '#1A1A1A' : '#888',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{t.label}</button>
        ))}
      </div>

      {/* 아이템 목록 */}
      {SHOP_ITEMS[tab].map((item, idx) => (
        <div key={idx} style={{
          background: '#fff', borderRadius: 14,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>{item.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{item.name}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, borderRadius: 50, padding: '2px 8px',
                background: 'var(--primary)', color: '#8B6800',
              }}>{item.tag}</span>
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>{item.desc}</div>
          </div>
          <div style={{ color: '#CCC', fontSize: 18, flexShrink: 0 }}>›</div>
        </div>
      ))}
      <div style={{ textAlign: 'center', padding: '8px', fontSize: 12, color: '#CCC' }}>
        실제 구매 연동은 준비 중이에요 🐾
      </div>
    </div>
  );
}

function CompatTab({ profiles }) {
  if (profiles.length < 2) {
    return (
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>강아지가 2마리 이상 필요해요!</div>
        <div style={{ fontSize: 13, color: '#999' }}>홈에서 강아지를 추가해주세요</div>
      </div>
    );
  }
  const pairs = [];
  for (let i = 0; i < profiles.length; i++)
    for (let j = i + 1; j < profiles.length; j++)
      pairs.push([profiles[i], profiles[j]]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#F3EEFF', borderRadius: 14, padding: '12px 16px', fontSize: 13, color: '#7C3AED', lineHeight: 1.6 }}>
        🔮 등록된 강아지들의 <strong>별자리 궁합</strong>을 알아봐요!
      </div>
      {pairs.map(([a, b], idx) => {
        const za = getZodiac(a.birth), zb = getZodiac(b.birth);
        const score = getCompat(za, zb);
        const label = compatLabel(score);
        const imgA = a.profileImages?.[0] || BREED_IMAGE[a.breed] || '/breeds/default.png';
        const imgB = b.profileImages?.[0] || BREED_IMAGE[b.breed] || '/breeds/default.png';
        return (
          <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--primary)', padding: '10px 16px', fontWeight: 700, fontSize: 14 }}>
              🐾 {a.name} & {b.name}의 궁합
            </div>
            <div style={{ padding: '16px' }}>
              {/* 프로필 두 개 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: '#FFF3B0', margin: '0 auto 4px' }}>
                    <img src={imgA} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>{za?.emoji} {za?.name}</div>
                </div>
                <div style={{ fontSize: 24 }}>💕</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: '#FFF3B0', margin: '0 auto 4px' }}>
                    <img src={imgB} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>{zb?.emoji} {zb?.name}</div>
                </div>
              </div>
              {/* 점수 바 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: label.color }}>{label.text}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: label.color }}>{score}점</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: '#EEE', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: label.color, width: `${score}%`, transition: 'width 1s ease' }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage({ profiles, setProfiles, onSelect, showAddForm, setShowAddForm }) {
  const [homeTab, setHomeTab] = useState('fortune');
  const [form, setForm] = useState({ name: '', gender: '', breed: '', birth: '', weight: '', neutered: false, profileImages: [] });
  const [err, setErr] = useState('');
  const fileRef = useRef(null);
  const zodiac = getZodiac(form.birth);

  useEffect(() => {
    if (showAddForm) window.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [showAddForm]);

  const handleImageUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setForm(f => ({ ...f, profileImages: [...f.profileImages, ev.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const handleAdd = () => {
    if (!form.name || !form.breed || !form.birth) { setErr('이름, 견종, 생년월일은 필수예요!'); return; }
    setErr('');
    const p = createProfile({ ...form, personality: '활발하고 에너지 넘침' });
    const updated = saveProfile(p);
    setProfiles(updated);
    setForm({ name: '', gender: '', breed: '', birth: '', weight: '', neutered: false, profileImages: [] });
    setShowAddForm(false);
    onSelect(p);
  };

  const homeTabs = [
    { key: 'fortune', label: '🔮 오늘의 운세' },
    { key: 'compat', label: '💕 궁합' },
    { key: 'shop', label: '🛍️ 물건 추천' },
  ];

  return (
    <div style={{ minHeight: '100dvh' }}>
      {/* 헤더 */}
      <div style={{
        background: '#fff', padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #F0F0F0',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>🐾 독팔자 상팔자</div>
        <div style={{ fontSize: 13, color: '#999' }}>
          {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
        </div>
      </div>

      {/* 배너 */}
      <div style={{ background: 'linear-gradient(135deg, #FFD020, #FFB800)', padding: '24px 24px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 16, top: 8, fontSize: 70, opacity: 0.18 }}>🐕</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#8B6800', marginBottom: 5 }}>✨ 오늘의 무료 운세</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>
          우리 강아지 오늘<br />운세는 어떨까? 🔮
        </div>
      </div>

      {/* 홈 탭 바 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EEE', padding: '0 16px', display: 'flex', gap: 0, position: 'sticky', top: 57, zIndex: 40 }}>
        {homeTabs.map(t => (
          <button key={t.key} onClick={() => setHomeTab(t.key)} style={{
            padding: '14px 12px', fontSize: 13, fontWeight: 600,
            color: homeTab === t.key ? 'var(--pink)' : '#AAA',
            borderBottom: homeTab === t.key ? '2.5px solid var(--pink)' : '2.5px solid transparent',
            whiteSpace: 'nowrap', flex: 1,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 오늘의 운세 탭 */}
        {homeTab === 'fortune' && (
          <>
            {profiles.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: 'var(--primary)', borderRadius: 8, padding: '4px 12px', fontSize: 14, fontWeight: 700 }}>🐶 내 강아지</div>
                    <span style={{ background: 'var(--pink)', color: '#fff', borderRadius: 50, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{profiles.length}</span>
                  </div>
                  <button onClick={() => setShowAddForm(f => !f)} style={{ fontSize: 13, color: 'var(--pink)', fontWeight: 600 }}>+ 추가</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {profiles.map(p => (
                    <DogCard key={p.id} profile={p}
                      onClick={() => onSelect(p)}
                      onDelete={() => setProfiles(deleteProfile(p.id))} />
                  ))}
                </div>
              </div>
            )}
            {profiles.length === 0 && !showAddForm && (
              <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>🐾</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>강아지를 등록해보세요!</div>
                <div style={{ fontSize: 14, color: '#999', marginBottom: 24 }}>우리 강아지 맞춤 운세를 받아보세요</div>
                <button onClick={() => setShowAddForm(true)} style={{ background: 'var(--primary)', color: '#1A1A1A', borderRadius: 50, padding: '14px 32px', fontSize: 16, fontWeight: 700, boxShadow: '0 4px 16px rgba(255,208,32,0.4)' }}>
                  🐶 내 강아지 추가하기
                </button>
              </div>
            )}
            {profiles.length > 0 && !showAddForm && (
              <button onClick={() => setShowAddForm(true)} style={{ width: '100%', padding: '14px', background: '#fff', border: '2px dashed #FFD020', borderRadius: 16, color: '#888', fontSize: 15, fontWeight: 500 }}>
                + 내 강아지 추가
              </button>
            )}
          </>
        )}

        {/* 궁합 탭 */}
        {homeTab === 'compat' && <CompatTab profiles={profiles} />}

        {/* 물건 추천 탭 */}
        {homeTab === 'shop' && <ShopTab />}

        {/* 추가 폼 */}
        {showAddForm && (
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--primary)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>🐶 내 강아지 추가</span>
              <button onClick={() => setShowAddForm(false)} style={{ fontSize: 20, color: '#666' }}>✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#FFF3B0', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#8B6800' }}>
                ✏️ 이름, 견종, 생년월일은 <strong>필수</strong>예요
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" placeholder="강아지 이름 *" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ ...inputStyle, flex: 1 }} />
                <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                  style={{ ...inputStyle, width: 86, flex: 'none', appearance: 'none', textAlign: 'center' }}>
                  <option value="">성별</option>
                  <option value="남아">남아 🐾</option>
                  <option value="여아">여아 🎀</option>
                </select>
              </div>
              <select value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">견종 선택 *</option>
                {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <div>
                <input type="date" value={form.birth}
                  onChange={e => setForm(f => ({ ...f, birth: e.target.value }))}
                  style={{ ...inputStyle, colorScheme: 'light' }} />
                {zodiac && (
                  <div style={{ marginTop: 8, padding: '8px 14px', background: '#F3EEFF', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span>{zodiac.emoji}</span>
                    <span style={{ fontSize: 13, color: '#7C3AED', fontWeight: 500 }}>{zodiac.name} · {zodiac.trait}</span>
                  </div>
                )}
              </div>
              <div style={{ borderTop: '1.5px dashed #EEE', margin: '4px 0' }} />
              <div style={{ fontSize: 12, color: '#AAA', fontWeight: 500 }}>선택 정보</div>
              <div>
                <button type="button" onClick={() => fileRef.current?.click()}
                  style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', color: '#999' }}>
                  📷 프로필 사진 추가 (여러 장 가능)
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
                {form.profileImages.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {form.profileImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={img} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: '2px solid var(--primary)' }} />
                        <button onClick={() => setForm(f => ({ ...f, profileImages: f.profileImages.filter((_, i) => i !== idx) }))}
                          style={{ position: 'absolute', top: -6, right: -6, background: '#FF5FA0', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input type="number" placeholder="몸무게 (kg)" value={form.weight}
                onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                style={inputStyle} min="0" step="0.1" />
              <div onClick={() => setForm(f => ({ ...f, neutered: !f.neutered }))}
                style={{ ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#555' }}>✂️ 중성화 여부</span>
                <div style={{ width: 46, height: 26, borderRadius: 13, background: form.neutered ? '#7C3AED' : '#DDD', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.neutered ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>
              {err && <div style={{ background: '#FFF0F0', borderRadius: 10, padding: '10px 14px', color: '#FF4444', fontSize: 13, fontWeight: 500 }}>⚠️ {err}</div>}
              <button onClick={handleAdd} style={{ width: '100%', padding: '16px', background: 'var(--pink)', borderRadius: 14, color: '#fff', fontSize: 17, fontWeight: 700, boxShadow: '0 4px 16px rgba(255,95,160,0.35)', marginTop: 4 }}>
                저장하기 🐾
              </button>
            </div>
          </div>
        )}
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
