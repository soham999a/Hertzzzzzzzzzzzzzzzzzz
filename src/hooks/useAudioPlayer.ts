import { useState, useRef, useCallback, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RadioStation } from '@/types/radio';
import { useSleepTimer, SleepDuration } from './useSleepTimer';
import { useRecentlyPlayed } from './useRecentlyPlayed';

interface AudioPlayerState {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  isLoading: boolean;
  error: string | null;
  sleepTimerRemaining: string | null;
  sleepTimerActive: boolean;
  sleepTimerDuration: SleepDuration;
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentStation: null,
    isPlaying: false,
    volume: 0.7,
    isLoading: false,
    error: null,
    sleepTimerRemaining: null,
    sleepTimerActive: false,
    sleepTimerDuration: null,
  });

  const { recent, addRecent } = useRecentlyPlayed();

  const pauseFn = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const sleepTimer = useSleepTimer(pauseFn);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;

    const audio = audioRef.current;

    audio.addEventListener('playing', () => {
      setState(prev => ({ ...prev, isPlaying: true, isLoading: false, error: null }));
    });

    audio.addEventListener('pause', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener('waiting', () => {
      setState(prev => ({ ...prev, isLoading: true }));
    });

    audio.addEventListener('error', () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: 'Station unavailable',
      }));
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      sleepTimerRemaining: sleepTimer.formatted,
      sleepTimerActive: sleepTimer.isActive,
      sleepTimerDuration: sleepTimer.duration,
    }));
  }, [sleepTimer.formatted, sleepTimer.isActive, sleepTimer.duration]);

  const recordListen = useCallback(async (station: RadioStation) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const ref = doc(db, 'listens', user.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : { stations: {} };
      const entry = data.stations[station.id] || { id: station.id, name: station.name, count: 0, last: 0 };
      entry.count += 1; entry.last = Date.now();
      data.stations[station.id] = entry;
      await setDoc(ref, data, { merge: true });

      const rewardRef = doc(db, 'rewards', user.uid);
      const rewardSnap = await getDoc(rewardRef);
      const rewardData = rewardSnap.exists() ? rewardSnap.data() : { points: 0, listens: 0 };
      rewardData.points = (rewardData.points || 0) + 1;
      rewardData.listens = (rewardData.listens || 0) + 1;
      await setDoc(rewardRef, rewardData, { merge: true });
    } catch { /* best-effort */ }
  }, []);

  const play = useCallback((station: RadioStation) => {
    if (!audioRef.current) return;
    const streamUrl = station.url_resolved || station.url;
    if (!streamUrl) {
      setState(prev => ({ ...prev, currentStation: station, isPlaying: false, isLoading: false, error: 'Invalid URL' }));
      return;
    }
    setState(prev => ({ ...prev, currentStation: station, isLoading: true, error: null }));
    audioRef.current.src = streamUrl;
    audioRef.current.play().catch(() => {
      setState(prev => ({ ...prev, isPlaying: false, isLoading: false, error: 'Station offline' }));
    });
    recordListen(station);
    addRecent(station);
  }, [recordListen, addRecent]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !state.currentStation) return;
    if (state.isPlaying) pause();
    else audioRef.current.play().catch(() => {});
  }, [state.isPlaying, state.currentStation, pause]);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = '';
    setState(prev => ({
      ...prev,
      currentStation: null,
      isPlaying: false,
      isLoading: false,
    }));
  }, []);

  const startSleepTimer = useCallback((mins: SleepDuration) => {
    sleepTimer.start(mins);
  }, [sleepTimer]);

  const cancelSleepTimer = useCallback(() => {
    sleepTimer.clear();
  }, [sleepTimer]);

  return {
    ...state,
    play,
    pause,
    togglePlayPause,
    setVolume,
    stop,
    recent,
    startSleepTimer,
    cancelSleepTimer,
  };
}
