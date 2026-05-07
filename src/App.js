import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import FortunePage from './pages/FortunePage';
import FriendsPage from './pages/FriendsPage';
import CalendarPage from './pages/CalendarPage';
import BottomNav from './components/BottomNav';
import { loadProfiles } from './utils/storage';
import './index.css';

export default function App() {
  const [profiles, setProfiles] = useState(() => loadProfiles());
  const [selectedDog, setSelectedDog] = useState(null);
  const [page, setPage] = useState('home'); // home | friends | calendar | settings
  const [showAddForm, setShowAddForm] = useState(false);

  const goHome = () => { setSelectedDog(null); setPage('home'); };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 'var(--nav-h)' }}>
      {selectedDog ? (
        <FortunePage dog={selectedDog} onBack={goHome} />
      ) : page === 'friends' ? (
        <FriendsPage profiles={profiles} />
      ) : page === 'calendar' ? (
        <CalendarPage profiles={profiles} />
      ) : (
        <HomePage
          profiles={profiles}
          setProfiles={setProfiles}
          onSelect={setSelectedDog}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
        />
      )}

      <BottomNav
        page={selectedDog ? 'fortune' : page}
        onHome={goHome}
        onFriends={() => { setSelectedDog(null); setPage('friends'); }}
        onFortune={() => selectedDog ? setSelectedDog(selectedDog) : null}
        onCalendar={() => { setSelectedDog(null); setPage('calendar'); }}
        onSettings={() => {}}
      />
    </div>
  );
}
