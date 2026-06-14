import React, { createContext, useContext, ReactNode } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useFavorites } from '@/hooks/useFavorites';
import { RadioStation } from '@/types/radio';
import { SleepDuration } from '@/hooks/useSleepTimer';

interface PlayerContextType {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  isLoading: boolean;
  error: string | null;
  play: (station: RadioStation) => void;
  pause: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  stop: () => void;
  favorites: RadioStation[];
  isFavorite: (stationId: string) => boolean;
  toggleFavorite: (station: RadioStation) => void;
  recent: RadioStation[];
  sleepTimerRemaining: string | null;
  sleepTimerActive: boolean;
  startSleepTimer: (mins: SleepDuration) => void;
  cancelSleepTimer: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioPlayer = useAudioPlayer();
  const favoritesHook = useFavorites();

  return (
    <PlayerContext.Provider value={{ ...audioPlayer, ...favoritesHook }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
}
