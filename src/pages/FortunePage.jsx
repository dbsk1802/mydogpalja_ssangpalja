import React, { useEffect, useState } from 'react';
import ScoreMeter from '../components/ScoreMeter';
import { BREED_IMAGE } from '../utils/breeds';
import { getZodiac, getAge } from '../utils/zodiac';
import { fetchFortune } from '../utils/api';
import { generateShareCard } from '../utils/shareCard';

const SCORE_COLORS = {
  snack: '#FF5FA0', walk: '#7C3AED', love: '#FF9500', nap: '#00C2B2'
};
const SCORE_LABELS = {
  snack: '🍗 간식운', walk: '🌿 산책운', love: '💕 사랑운', nap: '😴 낮잠운'
};

export default function FortunePage({ dog, onBack }) {
  const [fortune, setFortune] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sharing, setSharing] = useState(false);
  const [cardImg, setCardImg] = useState(null);

  const zodiac = getZodiac(dog.birth);
  const age = getAge(dog.birth);
  const imgSrc = dog.profileImages?.[0] || BREED_IMAGE[dog.breed] || '/breeds/default.png';

  const load = async () => {
    setLoading(true); setError(''); setFortune(null); setCardImg(null);
    try {
      const f = await fetchFortune({ ...dog, zodiac });
      setFortune(f);
    } catch {
      setError('운세를 불러오는 데 실패했어요.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [dog]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShare = async () => {
    if (!fortune) return;
    setSharing(true);
    try {
      const img = await generateShareCard({ dog, fortune, zodiac });
      setCardImg(img);
    } catch { alert('카드 생성에 실패했어요.'); }
    setSharing(false);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.download = `${dog.name}_운세카드.png`;
    a.href = cardImg;
    a.click();
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>

      {/* 상단 헤더 */}
      <div style={{
        background: '#fff',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #F0F0F0',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={onBack} style={{ fontSize: 14, color: '#666', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← 홈
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
          🔮 오늘의 운세
        </div>
        <button onClick={load} style={{ fontSize: 13, color: 'var(--pink)', fontWeight: 600 }}>
          다시뽑기
        </button>
      </div>

      {/* 강아지 프로필 배너 */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD020, #FFB800)',
        padding: '24px 20px 32px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0.08, fontSize: 120 }}>🐾</div>
        {/* 강아지 이미지 */}
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          overflow: 'hidden',
          background: '#fff',
          border: '3px solid #fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          margin: '0 auto 12px',
        }}>
          <img src={imgSrc} alt={dog.breed}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
          {dog.name}
          {dog.gender && (
            <span style={{
              marginLeft: 6, fontSize: 12, fontWeight: 600,
              background: dog.gender === '남아' ? '#DBEAFE' : '#FCE7F3',
              color: dog.gender === '남아' ? '#2563EB' : '#DB2777',
              borderRadius: 50, padding: '2px 8px',
            }}>{dog.gender}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.7)', borderRadius: 50, padding: '3px 12px', color: '#555', fontWeight: 500 }}>
            {dog.breed}
          </span>
          {age && (
            <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.7)', borderRadius: 50, padding: '3px 12px', color: '#555', fontWeight: 500 }}>
              {age}
            </span>
          )}
          {zodiac && (
            <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.7)', borderRadius: 50, padding: '3px 12px', color: '#7C3AED', fontWeight: 600 }}>
              {zodiac.emoji} {zodiac.name}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 로딩 */}
        {loading && (
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow)', padding: '48px 20px', textAlign: 'center' }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
            <div style={{ fontSize: 56, animation: 'bounce 1.2s ease-in-out infinite', marginBottom: 16 }}>🔮</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>별자리를 읽는 중...</div>
            <div style={{ fontSize: 13, color: '#999' }}>오늘의 운세를 계산하고 있어요</div>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow)', padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😢</div>
            <div style={{ fontSize: 15, color: '#666', marginBottom: 16 }}>{error}</div>
            <button onClick={load} style={{
              background: 'var(--pink)', color: '#fff',
              borderRadius: 50, padding: '12px 28px',
              fontSize: 15, fontWeight: 700,
            }}>다시 시도</button>
          </div>
        )}

        {fortune && !loading && (
          <>
            {/* 종합 운세 */}
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--primary)', padding: '12px 16px', fontWeight: 700, fontSize: 14 }}>
                🌟 오늘의 종합운세
              </div>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', marginBottom: 6 }}>
                  {fortune.overall}
                </div>
                <div style={{ fontSize: 14, color: '#666' }}>{fortune.overall_sub}</div>
              </div>
            </div>

            {/* 점수 게이지 */}
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--primary)', padding: '12px 16px', fontWeight: 700, fontSize: 14 }}>
                📊 오늘의 운세 점수
              </div>
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['snack', 'walk', 'love', 'nap'].map(k => (
                  <ScoreMeter key={k}
                    label={SCORE_LABELS[k]}
                    score={fortune[k].score}
                    text={fortune[k].text}
                    color={SCORE_COLORS[k]}
                  />
                ))}
              </div>
            </div>

            {/* 오늘의 메시지 */}
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--primary)', padding: '12px 16px', fontWeight: 700, fontSize: 14 }}>
                💬 오늘의 메시지
              </div>
              <div style={{ padding: '18px 16px' }}>
                <p style={{ fontSize: 14, lineHeight: 1.9, color: '#444' }}>{fortune.detail}</p>
              </div>
            </div>

            {/* 별자리 팁 */}
            {fortune.zodiac_tip && (
              <div style={{
                background: '#F3EEFF', borderRadius: 16,
                padding: '14px 16px',
                display: 'flex', gap: 10, alignItems: 'flex-start',
                border: '1.5px solid #EDE9FE',
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{zodiac?.emoji || '⭐'}</span>
                <p style={{ fontSize: 13, color: '#7C3AED', lineHeight: 1.6 }}>{fortune.zodiac_tip}</p>
              </div>
            )}

            {/* 행운 / 주의 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                <div style={{ background: '#FFF3B0', padding: '8px 12px', fontSize: 12, fontWeight: 700 }}>✨ 행운 아이템</div>
                <div style={{ padding: '12px', fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{fortune.lucky_item}</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                <div style={{ background: '#FFE4E4', padding: '8px 12px', fontSize: 12, fontWeight: 700, color: '#CC0000' }}>⚠️ 오늘의 주의</div>
                <div style={{ padding: '12px', fontSize: 13, color: '#555' }}>{fortune.warn}</div>
              </div>
            </div>

            {/* 인스타 카드 */}
            {!cardImg ? (
              <button
                onClick={handleShare}
                disabled={sharing}
                style={{
                  width: '100%', padding: '16px',
                  background: sharing ? '#EEE' : 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                  borderRadius: 16, color: '#fff',
                  fontSize: 16, fontWeight: 700,
                  boxShadow: sharing ? 'none' : '0 4px 16px rgba(131,58,180,0.35)',
                }}
              >
                {sharing ? '카드 생성 중...' : '📸 인스타 스토리 카드 만들기'}
              </button>
            ) : (
              <div>
                <p style={{ fontSize: 13, color: '#999', marginBottom: 10, textAlign: 'center' }}>카드 미리보기</p>
                <img src={cardImg} alt="운세 카드"
                  style={{ width: '100%', borderRadius: 16, marginBottom: 10, boxShadow: 'var(--shadow-lg)' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button onClick={handleDownload} style={{
                    padding: '14px', background: 'var(--pink)',
                    borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 700,
                  }}>이미지 저장</button>
                  <button onClick={() => setCardImg(null)} style={{
                    padding: '14px', background: '#F0F0F0',
                    borderRadius: 14, color: '#555', fontSize: 15, fontWeight: 500,
                  }}>닫기</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
