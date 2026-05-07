import React, { useState } from 'react';
import { BREED_IMAGE } from '../utils/breeds';

const STORAGE_KEY = 'dog_fortune_calendar';

function loadCalendar() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveCalendar(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const CONDITION_OPTIONS = ['최고 😍', '좋음 😊', '보통 😐', '안좋음 😟', '아픔 😢'];
const WALK_OPTIONS = ['산책 안함', '10분', '20분', '30분', '1시간', '1시간 이상'];

function MemoModal({ date, dogId, dogName, data, onSave, onClose }) {
  const [memo, setMemo] = useState(data?.memo || '');
  const [condition, setCondition] = useState(data?.condition || '');
  const [walk, setWalk] = useState(data?.walk || '');
  const [health, setHealth] = useState(data?.health || '');

  const handleSave = () => {
    onSave({ memo, condition, walk, health });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '24px 24px 0 0',
        width: '100%', maxWidth: 430,
        maxHeight: '85dvh', overflowY: 'auto',
        padding: '0 0 32px',
      }}>
        {/* 핸들 */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
          <div style={{ width: 40, height: 4, background: '#EEE', borderRadius: 2 }} />
        </div>

        {/* 헤더 */}
        <div style={{ background: 'var(--primary)', padding: '12px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{date} 기록</div>
            <div style={{ fontSize: 12, color: '#8B6800' }}>🐾 {dogName}의 하루</div>
          </div>
          <button onClick={onClose} style={{ fontSize: 20, color: '#666' }}>✕</button>
        </div>

        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 컨디션 */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 8 }}>😊 오늘의 컨디션</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CONDITION_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setCondition(opt)} style={{
                  padding: '8px 14px', borderRadius: 50, fontSize: 13, fontWeight: 600,
                  background: condition === opt ? 'var(--primary)' : '#F0F0F0',
                  color: condition === opt ? '#1A1A1A' : '#888',
                  border: condition === opt ? '2px solid var(--primary-dark)' : '2px solid transparent',
                }}>{opt}</button>
              ))}
            </div>
          </div>

          {/* 산책 */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 8 }}>🌿 산책 시간</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {WALK_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setWalk(opt)} style={{
                  padding: '8px 14px', borderRadius: 50, fontSize: 13, fontWeight: 600,
                  background: walk === opt ? '#7C3AED' : '#F0F0F0',
                  color: walk === opt ? '#fff' : '#888',
                }}>{opt}</button>
              ))}
            </div>
          </div>

          {/* 건강 특이사항 */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 8 }}>💊 건강 특이사항</div>
            <input
              type="text" placeholder="예: 구토 1회, 기침, 이상 없음..."
              value={health} onChange={e => setHealth(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: '#F8F8F8', border: '1.5px solid #EEE', borderRadius: 12, fontSize: 14 }}
            />
          </div>

          {/* 메모 */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 8 }}>📝 오늘의 메모</div>
            <textarea
              placeholder="오늘 하루 기억하고 싶은 것들을 적어보세요..."
              value={memo} onChange={e => setMemo(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '12px 14px', background: '#F8F8F8', border: '1.5px solid #EEE', borderRadius: 12, fontSize: 14, resize: 'none', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <button onClick={handleSave} style={{
            width: '100%', padding: '15px',
            background: 'var(--pink)', color: '#fff',
            borderRadius: 14, fontSize: 16, fontWeight: 700,
            boxShadow: '0 4px 16px rgba(255,95,160,0.35)',
          }}>저장하기 💾</button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage({ profiles }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDogId, setSelectedDogId] = useState(profiles[0]?.id || null);
  const [calData, setCalData] = useState(loadCalendar);
  const [selectedDate, setSelectedDate] = useState(null);

  const selectedDog = profiles.find(p => p.id === selectedDogId);
  const imgSrc = selectedDog ? (selectedDog.profileImages?.[0] || BREED_IMAGE[selectedDog.breed] || '/breeds/default.png') : null;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const getDayData = (d) => calData[selectedDogId]?.[dateKey(d)];

  const handleSave = (d, data) => {
    const key = dateKey(d);
    const next = {
      ...calData,
      [selectedDogId]: { ...(calData[selectedDogId] || {}), [key]: data },
    };
    setCalData(next);
    saveCalendar(next);
  };

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const conditionEmoji = (d) => {
    const c = getDayData(d)?.condition || '';
    if (c.includes('최고')) return '😍';
    if (c.includes('좋음')) return '😊';
    if (c.includes('보통')) return '😐';
    if (c.includes('안좋음')) return '😟';
    if (c.includes('아픔')) return '😢';
    return null;
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      {/* 헤더 */}
      <div style={{ background: '#fff', padding: '14px 20px', borderBottom: '1px solid #F0F0F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>📅 모아보기</div>
      </div>

      {/* 강아지 선택 */}
      {profiles.length > 0 && (
        <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #EEE', display: 'flex', gap: 10, overflowX: 'auto' }}>
          {profiles.map(p => {
            const img = p.profileImages?.[0] || BREED_IMAGE[p.breed] || '/breeds/default.png';
            const active = selectedDogId === p.id;
            return (
              <button key={p.id} onClick={() => setSelectedDogId(p.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', background: '#FFF3B0', border: active ? '3px solid var(--pink)' : '3px solid #EEE' }}>
                  <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? 'var(--pink)' : '#AAA' }}>{p.name}</span>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ padding: '16px' }}>
        {profiles.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>강아지를 먼저 등록해주세요!</div>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            {/* 달력 헤더 */}
            <div style={{ background: 'var(--primary)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={prevMonth} style={{ fontSize: 20, color: '#8B6800', padding: '0 8px' }}>‹</button>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{year}년 {month + 1}월</div>
              <button onClick={nextMonth} style={{ fontSize: 20, color: '#8B6800', padding: '0 8px' }}>›</button>
            </div>

            {/* 요일 헤더 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#FFF8E0' }}>
              {WEEKDAYS.map((d, i) => (
                <div key={d} style={{ textAlign: 'center', padding: '8px 0', fontSize: 12, fontWeight: 700, color: i === 0 ? '#FF5FA0' : i === 6 ? '#7C3AED' : '#666' }}>{d}</div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
              {/* 빈 칸 */}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} style={{ minHeight: 52, borderBottom: '1px solid #F5F5F5', borderRight: '1px solid #F5F5F5' }} />)}
              {/* 날짜 */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
                const dayData = getDayData(d);
                const emoji = conditionEmoji(d);
                const col = (firstDay + d - 1) % 7;
                return (
                  <div key={d} onClick={() => setSelectedDate(d)} style={{
                    minHeight: 52, padding: '6px 4px',
                    borderBottom: '1px solid #F5F5F5',
                    borderRight: '1px solid #F5F5F5',
                    cursor: 'pointer', textAlign: 'center',
                    background: isToday ? '#FFF8E0' : '#fff',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: isToday ? 'var(--primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 2px',
                      fontSize: 12, fontWeight: isToday ? 800 : 400,
                      color: col === 0 ? '#FF5FA0' : col === 6 ? '#7C3AED' : '#333',
                    }}>{d}</div>
                    {emoji && <div style={{ fontSize: 14, lineHeight: 1 }}>{emoji}</div>}
                    {dayData?.walk && !emoji && <div style={{ fontSize: 9, color: '#AAA' }}>🌿</div>}
                  </div>
                );
              })}
            </div>

            {/* 범례 */}
            <div style={{ padding: '12px 16px', background: '#F8F8F8', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['😍 최고', '😊 좋음', '😐 보통', '😟 안좋음', '😢 아픔'].map(l => (
                <span key={l} style={{ fontSize: 11, color: '#888' }}>{l}</span>
              ))}
            </div>
          </div>
        )}

        {/* 최근 기록 */}
        {selectedDogId && calData[selectedDogId] && (
          <div style={{ marginTop: 16, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--primary)', padding: '12px 16px', fontWeight: 700, fontSize: 14 }}>📋 최근 기록</div>
            <div style={{ padding: '4px 0' }}>
              {Object.entries(calData[selectedDogId] || {})
                .filter(([, v]) => v.condition || v.walk || v.memo || v.health)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 5)
                .map(([date, v]) => (
                  <div key={date} style={{ padding: '12px 16px', borderBottom: '1px solid #F5F5F5', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 11, color: '#999', flexShrink: 0, paddingTop: 2 }}>{date.slice(5)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: v.memo ? 4 : 0 }}>
                        {v.condition && <span style={{ background: '#FFF3B0', borderRadius: 50, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{v.condition}</span>}
                        {v.walk && v.walk !== '산책 안함' && <span style={{ background: '#E8F5E9', borderRadius: 50, padding: '2px 10px', fontSize: 12, fontWeight: 600, color: '#388E3C' }}>🌿 {v.walk}</span>}
                        {v.health && <span style={{ background: '#FFF3E0', borderRadius: 50, padding: '2px 10px', fontSize: 12, fontWeight: 600, color: '#E65100' }}>💊 {v.health}</span>}
                      </div>
                      {v.memo && <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{v.memo}</div>}
                    </div>
                  </div>
                ))}
              {Object.keys(calData[selectedDogId] || {}).length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: '#AAA', fontSize: 13 }}>날짜를 탭해서 기록을 추가해보세요! 🐾</div>
              )}
            </div>
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>

      {/* 메모 모달 */}
      {selectedDate && (
        <MemoModal
          date={`${month + 1}월 ${selectedDate}일`}
          dogId={selectedDogId}
          dogName={selectedDog?.name || ''}
          data={getDayData(selectedDate)}
          onSave={(data) => handleSave(selectedDate, data)}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
