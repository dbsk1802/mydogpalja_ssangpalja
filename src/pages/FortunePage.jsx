import React, { useEffect, useState } from 'react';
import ScoreMeter from '../components/ScoreMeter';
import { BREED_EMOJI } from '../utils/breeds';
import { getZodiac, getAge } from '../utils/zodiac';
import { fetchFortune } from '../utils/api';
import { generateShareCard } from '../utils/shareCard';

const SCORE_COLORS = {
  snack: '#7fffd4', walk: '#8b6fd4', love: '#ff8fab', nap: '#ffb347'
};
const SCORE_LABELS = {
  snack: '🍗 간식', walk: '🌿 산책', love: '💕 사랑받기', nap: '😴 낮잠'
};

function LoadingPulse() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
      `}</style>
      <div style={{ fontSize: 64, animation: 'float 2s ease-in-out infinite', marginBottom: 24 }}>🔮</div>
      <p style={{ color: '#c4b0f5', fontFamily: 'var(--font-display)', fontSize: 22 }}>별자리를 읽는 중...</p>
      <p style={{ color: 'rgba(196,176,245,0.5)', fontSize: 14, marginTop: 8, fontWeight: 300 }}>오늘의 운세를 계산하고 있어요</p>
    </div>
  );
}

export default function FortunePage({ dog, onBack, onRefresh }) {
  const [fortune, setFortune] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sharing, setSharing] = useState(false);
  const [cardImg, setCardImg] = useState(null);

  const zodiac = getZodiac(dog.birth);
  const age = getAge(dog.birth);

  const load = async () => {
    setLoading(true); setError(''); setCardImg(null);
    try {
      const f = await fetchFortune({ ...dog, zodiac });
      setFortune(f);
    } catch {
      setError('운세를 불러오는 데 실패했어요. 다시 시도해 주세요.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [dog]);

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
    <div style={{ position: 'relative', zIndex: 1 }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(139,111,212,0.3)} 50%{box-shadow:0 0 40px rgba(139,111,212,0.6)} }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={onBack} style={{ background: 'none', color: 'rgba(196,176,245,0.7)', fontSize: 14, fontWeight: 300 }}>
          ← 목록
        </button>
        <span style={{ fontSize: 13, color: 'rgba(196,176,245,0.5)', fontWeight: 300 }}>
          {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
        </span>
        <button onClick={load} style={{ background: 'none', color: 'rgba(196,176,245,0.7)', fontSize: 14, fontWeight: 300 }}>
          다시 뽑기
        </button>
      </div>

      {/* Dog hero */}
      <div style={{ textAlign: 'center', padding: '32px 20px 24px' }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(74,47,160,0.4)',
          border: '2px solid rgba(139,111,212,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: 52,
          animation: 'glow 3s ease-in-out infinite',
        }}>
          {BREED_EMOJI[dog.breed] || '🐶'}
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{dog.name}</h2>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, background: 'rgba(139,111,212,0.2)', color: '#c4b0f5' }}>{dog.breed}</span>
          {age && <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', color: 'rgba(240,232,255,0.7)' }}>{age}</span>}
          {zodiac && (
            <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, background: 'rgba(255,216,122,0.15)', color: '#ffd87a' }}>
              {zodiac.emoji} {zodiac.name}
            </span>
          )}
        </div>
      </div>

      {loading && <LoadingPulse />}

      {error && (
        <div style={{ padding: '0 20px', textAlign: 'center' }}>
          <p style={{ color: '#ff8fab', marginBottom: 12 }}>{error}</p>
          <button onClick={load} style={{ padding: '10px 24px', background: 'rgba(255,143,171,0.2)', border: '1px solid rgba(255,143,171,0.4)', borderRadius: 12, color: '#ff8fab' }}>재시도</button>
        </div>
      )}

      {fortune && !loading && (
        <div style={{ padding: '0 20px 40px' }}>

          {/* Overall */}
          <div className="fade-up" style={{
            background: 'linear-gradient(135deg, rgba(74,47,160,0.4), rgba(139,111,212,0.2))',
            border: '1px solid rgba(139,111,212,0.3)',
            borderRadius: 20, padding: '22px',
            textAlign: 'center', marginBottom: 16,
            animationDelay: '0.1s',
          }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#ffd87a', marginBottom: 6 }}>{fortune.overall}</p>
            <p style={{ fontSize: 14, color: 'rgba(240,232,255,0.65)', fontWeight: 300 }}>{fortune.overall_sub}</p>
          </div>

          {/* Scores */}
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16, animationDelay: '0.2s' }}>
            {['snack','walk','love','nap'].map(k => (
              <ScoreMeter key={k}
                label={SCORE_LABELS[k]}
                score={fortune[k].score}
                text={fortune[k].text}
                color={SCORE_COLORS[k]}
              />
            ))}
          </div>

          {/* Detail */}
          <div className="fade-up" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18, padding: '18px',
            marginBottom: 12, animationDelay: '0.3s',
          }}>
            <p style={{ fontSize: 13, color: 'rgba(196,176,245,0.5)', marginBottom: 10, fontWeight: 300 }}>오늘의 메시지</p>
            <p style={{ fontSize: 15, lineHeight: 1.8, fontWeight: 300, color: 'rgba(240,232,255,0.85)' }}>{fortune.detail}</p>
          </div>

          {/* Zodiac tip */}
          {fortune.zodiac_tip && (
            <div className="fade-up" style={{
              background: 'rgba(255,216,122,0.08)',
              border: '1px solid rgba(255,216,122,0.2)',
              borderRadius: 14, padding: '14px 16px',
              marginBottom: 12, animationDelay: '0.35s',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{zodiac?.emoji || '⭐'}</span>
              <p style={{ fontSize: 14, color: '#ffd87a', fontWeight: 300, lineHeight: 1.6 }}>{fortune.zodiac_tip}</p>
            </div>
          )}

          {/* Lucky & warn */}
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, animationDelay: '0.4s' }}>
            <div style={{ background: 'rgba(127,255,212,0.08)', border: '1px solid rgba(127,255,212,0.2)', borderRadius: 14, padding: '12px 14px' }}>
              <p style={{ fontSize: 11, color: 'rgba(127,255,212,0.6)', marginBottom: 4, fontWeight: 300 }}>행운 아이템</p>
              <p style={{ fontSize: 14, color: '#7fffd4', fontWeight: 500 }}>✨ {fortune.lucky_item}</p>
            </div>
            <div style={{ background: 'rgba(255,143,171,0.08)', border: '1px solid rgba(255,143,171,0.2)', borderRadius: 14, padding: '12px 14px' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,143,171,0.6)', marginBottom: 4, fontWeight: 300 }}>주의</p>
              <p style={{ fontSize: 14, color: '#ff8fab', fontWeight: 500 }}>⚠️ {fortune.warn}</p>
            </div>
          </div>

          {/* Share card section */}
          {!cardImg ? (
            <button
              onClick={handleShare}
              disabled={sharing}
              style={{
                width: '100%', padding: '16px',
                background: sharing ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                borderRadius: 16, color: 'white',
                fontSize: 16, fontWeight: 500,
                opacity: sharing ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {sharing ? '카드 생성 중...' : '📸 인스타 스토리 카드 만들기'}
            </button>
          ) : (
            <div style={{ marginTop: 4 }}>
              <p style={{ fontSize: 13, color: 'rgba(196,176,245,0.6)', marginBottom: 10, textAlign: 'center', fontWeight: 300 }}>카드 미리보기</p>
              <img src={cardImg} alt="운세 카드" style={{ width: '100%', borderRadius: 16, marginBottom: 12, border: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: '14px',
                    background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                    borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 500,
                  }}
                >
                  이미지 저장
                </button>
                <button
                  onClick={() => setCardImg(null)}
                  style={{
                    padding: '14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14, color: 'rgba(240,232,255,0.7)', fontSize: 15,
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
