import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import FortunePage from './pages/FortunePage';
import BottomNav from './components/BottomNav';
import { loadProfiles } from './utils/storage';
import './index.css';

export default function App() {
  const [profiles, setProfiles] = useState(() => loadProfiles());
  const [selectedDog, setSelectedDog] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 'var(--nav-h)' }}>
      {selectedDog ? (
        <FortunePage
          dog={selectedDog}
          onBack={() => setSelectedDog(null)}
        />
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
        page={selectedDog ? 'fortune' : 'home'}
        onHome={() => setSelectedDog(null)}
        onAdd={() => { setSelectedDog(null); setShowAddForm(true); }}
        onFortune={() => selectedDog && setSelectedDog(selectedDog)}
      />
    </div>
  );
}
