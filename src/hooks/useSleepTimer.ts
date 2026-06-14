import { useState, useRef, useCallback, useEffect } from 'react';

export type SleepDuration = 15 | 30 | 45 | 60 | null;

export function useSleepTimer(onTimeout: () => void) {
  const [duration, setDuration] = useState<SleepDuration>(null);
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);
  const durationRef = useRef<SleepDuration>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDuration(null);
    setRemaining(0);
    durationRef.current = null;
  }, []);

  const start = useCallback((mins: SleepDuration) => {
    if (!mins) { clear(); return; }
    clear();
    durationRef.current = mins;
    const ms = mins * 60 * 1000;
    startRef.current = Date.now();
    setDuration(mins);
    setRemaining(ms);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const left = Math.max(0, ms - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clear();
        onTimeout();
      }
    }, 1000);
  }, [clear, onTimeout]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const formatted = remaining > 0
    ? `${Math.floor(remaining / 60000)}:${String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0')}`
    : null;

  return { duration, remaining, formatted, start, clear, isActive: duration !== null };
}
