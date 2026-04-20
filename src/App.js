import React, { useState } from 'react';
import StarField from './components/StarField';
import HomePage from './pages/HomePage';
import FortunePage from './pages/FortunePage';
import { loadProfiles } from './utils/storage';
import './index.css';

export default function App() {
  const [profiles, setProfiles] = useState(() => loadProfiles());
  const [selectedDog, setSelectedDog] = useState(null);

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg, #0a0618 0%, #12092e 50%, #0a0618 100%)' }}>
      <StarField />
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
        />
      )}
    </div>
  );
}
