import { useState, useCallback } from 'react';
import { RadioStation } from '@/types/radio';

const STORAGE_KEY = 'hertz_recently_played';
const MAX_ITEMS = 10;

function load(): RadioStation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(stations: RadioStation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stations));
  } catch { /* noop */ }
}

export function useRecentlyPlayed() {
  const [recent, setRecent] = useState<RadioStation[]>(load);

  const addRecent = useCallback((station: RadioStation) => {
    setRecent(prev => {
      const filtered = prev.filter(s => s.id !== station.id);
      const updated = [station, ...filtered].slice(0, MAX_ITEMS);
      save(updated);
      return updated;
    });
  }, []);

  return { recent, addRecent };
}
