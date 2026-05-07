import React, { useState } from 'react';
import { BREED_IMAGE } from '../utils/breeds';
import { getZodiac } from '../utils/zodiac';

function ComingSoonBadge() {
  return (
    <span style={{ background: '#FFD020', color: '#8B6800', borderRadius: 50, padding: '2px 10px', fontSize: 11, fontWeight: 700, marginLeft: 6 }}>
      준비중
    </span>
  );
}

export default function FriendsPage({ profiles }) {
  const [code, setCode] = useState('');
  const myCode = 'DOG-' + (profiles[0]?.id?.slice(-6).toUpperCase() || 'XXXXXX');

  const todayFriend = profiles.length > 0 ? profiles[0] : null;
  const zodiac = todayFriend ? getZodiac(todayFriend.birth) : null;
  const imgSrc = todayFriend ? (todayFriend.profileImages?.[0] || BREED_IMAGE[todayFriend.breed] || '/breeds/default.png') : null;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      {/* 헤더 */}
      <div style={{ background: '#fff', padding: '14px 20px', borderBottom: '1px solid #F0F0F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>🐶 친구</div>
      </div>

      {/* 배너 */}
      <div style={{ background: 'linear-gradient(135deg, #F3EEFF, #EDE9FE)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 16, top: 8, fontSize: 60, opacity: 0.2 }}>🤝</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#7C3AED', marginBottom: 5 }}>✨ 강아지 친구 맺기</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4 }}>
          친구 강아지와<br />오늘 궁합은? 💕
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 친구 코드 */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--primary)', padding: '12px 16px', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center' }}>
            🔑 친구 코드로 맺기 <ComingSoonBadge />
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* 내 코드 */}
            <div style={{ background: '#F8F8F8', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>내 강아지 코드</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2, color: '#7C3AED' }}>{myCode}</span>
                <button style={{ background: 'var(--primary)', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#8B6800' }}>복사</button>
              </div>
              <div style={{ fontSize: 11, color: '#AAA', marginTop: 4 }}>친구에게 이 코드를 공유해보세요!</div>
            </div>
            {/* 코드 입력 */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text" placeholder="친구 코드 입력 (DOG-XXXXXX)"
                value={code} onChange={e => setCode(e.target.value)}
                style={{ flex: 1, padding: '12px 14px', background: '#F8F8F8', border: '1.5px solid #EEE', borderRadius: 10, fontSize: 14 }}
              />
              <button onClick={() => alert('준비 중인 기능이에요! 🐾')}
                style={{ background: 'var(--pink)', color: '#fff', borderRadius: 10, padding: '0 18px', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                추가
              </button>
            </div>
          </div>
        </div>

        {/* 오늘의 친구 */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--primary)', padding: '12px 16px', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center' }}>
            🌟 오늘의 친구 <ComingSoonBadge />
          </div>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            {todayFriend ? (
              <>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>궁합 기반으로 선정된 오늘의 친구예요!</div>
                <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', background: '#FFF3B0', border: '3px solid var(--primary)', margin: '0 auto 10px' }}>
                  <img src={imgSrc} alt={todayFriend.breed} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{todayFriend.name}</div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>{zodiac?.emoji} {zodiac?.name} · {todayFriend.breed}</div>
                <div style={{ background: '#FFF3B0', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#8B6800', display: 'inline-block' }}>
                  💕 궁합 점수: <strong>서비스 오픈 후 공개</strong>
                </div>
              </>
            ) : (
              <div>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🐾</div>
                <div style={{ fontSize: 14, color: '#999' }}>강아지를 등록하면 오늘의 친구를 알려드려요!</div>
              </div>
            )}
          </div>
        </div>

        {/* 함께 카드 만들기 */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--primary)', padding: '12px 16px', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center' }}>
            📸 함께 카드 만들기 <ComingSoonBadge />
          </div>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            {/* 카드 미리보기 목업 */}
            <div style={{ background: 'linear-gradient(135deg, #F3EEFF, #FFD6E8)', borderRadius: 16, padding: '24px', marginBottom: 14, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: -10 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FFF3B0', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, zIndex: 2 }}>🐩</div>
                <div style={{ fontSize: 20, margin: '0 8px', zIndex: 3 }}>💕</div>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FFF3B0', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, zIndex: 2 }}>🐕</div>
              </div>
              <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: '#7C3AED' }}>우리의 궁합은? 💫</div>
              <div style={{ fontSize: 12, color: '#9B7AED', marginTop: 4 }}>오늘의 운세 & 함께한 추억</div>
            </div>
            <div style={{ fontSize: 13, color: '#999' }}>친구 강아지와 함께하는 인스타 카드를 만들어요!</div>
            <button onClick={() => alert('준비 중인 기능이에요! 🐾')}
              style={{ marginTop: 14, background: '#F0F0F0', color: '#AAA', borderRadius: 50, padding: '10px 24px', fontSize: 14, fontWeight: 600 }}>
              카드 만들기 (준비중)
            </button>
          </div>
        </div>

        {/* 친구 목록 */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ background: '#F0F0F0', padding: '12px 16px', fontWeight: 700, fontSize: 14, color: '#888', display: 'flex', alignItems: 'center' }}>
            👥 친구 강아지 목록 <ComingSoonBadge />
          </div>
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🐾</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#AAA', marginBottom: 4 }}>아직 친구가 없어요</div>
            <div style={{ fontSize: 12, color: '#CCC' }}>코드로 친구를 맺으면 여기에 표시돼요</div>
          </div>
        </div>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
