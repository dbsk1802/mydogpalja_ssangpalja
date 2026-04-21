import React from 'react';

export default function BottomNav({ page, onHome, onAdd, onFortune }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: '#fff',
      borderTop: '1px solid #EEEEEE',
      height: 'var(--nav-h)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {/* 홈 */}
      <NavItem icon="🏠" label="홈" active={page === 'home'} onClick={onHome} />

      {/* 강아지 추가 */}
      <NavItem icon="🐾" label="강아지추가" active={false} onClick={onAdd} />

      {/* 운세 (중앙 원형) */}
      <button onClick={onFortune} style={{
        width: 56, height: 56,
        borderRadius: '50%',
        background: page === 'fortune'
          ? 'linear-gradient(135deg, #7C3AED, #FF5FA0)'
          : 'linear-gradient(135deg, #9B59B6, #FF82B2)',
        boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        marginTop: -20,
        border: '3px solid white',
      }}>
        <span style={{ fontSize: 24 }}>🔮</span>
      </button>

      {/* 공유 */}
      <NavItem icon="📤" label="공유" active={false} onClick={() => {}} />

      {/* 설정 */}
      <NavItem icon="⚙️" label="설정" active={false} onClick={() => {}} />
    </nav>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      padding: '4px 12px',
      color: active ? 'var(--pink)' : 'var(--text-muted)',
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{label}</span>
    </button>
  );
}
