const KEY = 'dog_fortune_profiles';

export function loadProfiles() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function saveProfile(profile) {
  const profiles = loadProfiles();
  const existing = profiles.findIndex(p => p.id === profile.id);
  if (existing >= 0) profiles[existing] = profile;
  else profiles.push(profile);
  localStorage.setItem(KEY, JSON.stringify(profiles));
  return profiles;
}

export function deleteProfile(id) {
  const profiles = loadProfiles().filter(p => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(profiles));
  return profiles;
}

export function createProfile(data) {
  return { ...data, id: Date.now().toString() };
}
