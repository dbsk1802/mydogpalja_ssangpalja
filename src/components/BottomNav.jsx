import React from 'react';

export default function BottomNav({ page, onHome, onFriends, onFortune, onCalendar, onSettings }) {
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
      boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
    }}>
      <NavItem icon="🏠" label="홈" active={page === 'home'} onClick={onHome} />
      <NavItem icon="🐶" label="친구" active={page === 'friends'} onClick={onFriends} />

      {/* 중앙 운세 버튼 */}
      <button onClick={onFortune} style={{
        width: 58, height: 58, borderRadius: '50%',
        background: page === 'fortune'
          ? 'linear-gradient(135deg, #7C3AED, #FF5FA0)'
          : 'linear-gradient(135deg, #9B59B6, #FF82B2)',
        boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        marginTop: -22, border: '3px solid white',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 26 }}>🔮</span>
      </button>

      <NavItem icon="📅" label="모아보기" active={page === 'calendar'} onClick={onCalendar} />
      <NavItem icon="⚙️" label="설정" active={page === 'settings'} onClick={onSettings} />
    </nav>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      padding: '4px 10px', minWidth: 48,
      color: active ? 'var(--pink)' : '#AAAAAA',
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  );
}
