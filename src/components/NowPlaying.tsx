import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Heart, Share2, Volume2, VolumeX, Clock, X } from 'lucide-react';
import { RadioStation } from '@/types/radio';
import { usePlayer } from '@/contexts/PlayerContext';
import { cn } from '@/lib/utils';
import { useState, useRef, useCallback } from 'react';

// ── Visualizer Engine ──
function useVisualizerBars(active: boolean) {
  const barsRef = useRef<number[]>(Array.from({ length: 48 }, () => 0.15));
  const [bars, setBars] = useState<number[]>(barsRef.current);

  useCallback(() => {
    if (!active) {
      setBars(Array.from({ length: 48 }, () => 0.08));
      return;
    }
    const interval = setInterval(() => {
      barsRef.current = barsRef.current.map(() => {
        const target = 0.08 + Math.random() * 0.7;
        const current = barsRef.current[Math.floor(Math.random() * barsRef.current.length)] || 0.15;
        return current + (target - current) * 0.25;
      });
      setBars([...barsRef.current]);
    }, 60);
    return () => clearInterval(interval);
  }, [active]);

  return bars;
}

// ── Vinyl Record Disc ──
function VinylDisc({ station, isPlaying }: { station: RadioStation; isPlaying: boolean }) {
  const gradientId = `vinyl-grad-${station.id}`;
  return (
    <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-gold/10 blur-3xl animate-pulse-glow" />

      {/* Vinyl record */}
      <motion.div
        className="w-full h-full rounded-full relative"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: 'center' }}
      >
        {/* Vinyl base */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <defs>
            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="70%" stopColor="#111" />
              <stop offset="85%" stopColor="#222" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>
            <clipPath id={`vinyl-clip-${station.id}`}>
              <circle cx="50" cy="50" r="50" />
            </clipPath>
          </defs>
          <circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
          {/* Vinyl grooves */}
          {[24, 30, 36, 42].map(r => (
            <circle
              key={r}
              cx="50" cy="50" r={r}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />
          ))}
          {/* Center label */}
          <circle cx="50" cy="50" r="22" fill="rgba(255,182,144,0.08)" />
          <circle cx="50" cy="50" r="6" fill="#222" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        </svg>

        {/* Station image on label */}
        {station.favicon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[44px] h-[44px] rounded-full overflow-hidden ring-1 ring-white/10">
              <img
                src={station.favicon}
                alt=""
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
          </div>
        )}

        {/* Spinning highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
          }}
        />
      </motion.div>

      {/* Playing indicator ring */}
      {isPlaying && (
        <motion.div
          className="absolute -inset-2 rounded-full border border-primary/20"
          animate={{ rotate: -360, opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  );
}

// ── Visualizer Bars ──
function VisualizerBars({ isPlaying }: { isPlaying: boolean }) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: 48 }, () => 0.08)
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnim = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setHeights(prev => prev.map(() => 0.08 + Math.random() * 0.7));
    }, 80);
  };

  const stopAnim = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setHeights(Array.from({ length: 48 }, () => 0.06));
  };

  if (isPlaying) startAnim();
  else stopAnim();

  return (
    <div className="flex items-end justify-center gap-[3px] h-24 md:h-32 px-4">
      {heights.map((h, i) => {
        const isCenter = Math.abs(i - 24) < 4;
        return (
          <motion.div
            key={i}
            className={cn(
              'w-[3px] md:w-[4px] rounded-full',
              isCenter ? 'bg-gradient-gold' : 'bg-primary/40'
            )}
            animate={{ height: `${Math.max(4, h * 100)}%` }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.12 }}
          />
        );
      })}
    </div>
  );
}

// ── Sleep Timer Sheet ──
function SleepTimerSheet({ onSelect, current }: { onSelect: (mins: 15 | 30 | 45 | 60 | null) => void; current: number | null }) {
  const options = [
    { label: '15 min', value: 15 as const },
    { label: '30 min', value: 30 as const },
    { label: '45 min', value: 45 as const },
    { label: '60 min', value: 60 as const },
  ];

  return (
    <div className="glass-card rounded-2xl p-4 space-y-2">
      <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider mb-2">Sleep Timer</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onSelect(current === opt.value ? null : opt.value)}
            className={cn(
              'py-2 rounded-xl text-xs font-medium transition-all',
              current === opt.value
                ? 'bg-gradient-gold-dark text-white'
                : 'glass-card hover:bg-white/10'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {current && (
        <button
          onClick={() => onSelect(null)}
          className="w-full py-2 text-xs text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          Cancel Timer
        </button>
      )}
    </div>
  );
}

// ── Main NowPlaying Component ──
interface NowPlayingProps {
  station: RadioStation;
  isPlaying: boolean;
  isLoading: boolean;
  onClose: () => void;
}

export function NowPlaying({ station, isPlaying, isLoading, onClose }: NowPlayingProps) {
  const { pause, togglePlayPause, isFavorite, toggleFavorite, volume, setVolume } = usePlayer();
  const [showTimer, setShowTimer] = useState(false);
  const [sleepMins, setSleepMins] = useState<15 | 30 | 45 | 60 | null>(null);
  const favorited = isFavorite(station.id);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 80) onClose();
  };

  const handleShare = async () => {
    const text = `Listening to ${station.name} on Hertz!`;
    if (navigator.share) {
      await navigator.share({ title: station.name, text, url: station.homepage || window.location.href });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', bounce: 0.08, duration: 0.5 }}
      drag="y"
      dragDirectionLock
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      className="fixed inset-0 z-[60] flex flex-col"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-dot-grid opacity-30" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col overflow-y-auto">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowTimer(!showTimer)} className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Clock className={cn('w-4 h-4', sleepMins ? 'text-primary' : 'text-muted-foreground/60')} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Share2 className="w-4 h-4 text-muted-foreground/60 hover:text-foreground" />
            </button>
            <button onClick={() => toggleFavorite(station)} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Heart className={cn('w-4 h-4', favorited ? 'text-red-400 fill-red-400' : 'text-muted-foreground/60')} />
            </button>
          </div>
        </div>

        {/* Vinyl */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
          <VinylDisc station={station} isPlaying={isPlaying} />

          {/* Station info */}
          <div className="text-center mt-6 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{station.name}</h2>
            <p className="text-sm text-muted-foreground/50 mt-1">
              {station.country}{station.language ? ` · ${station.language}` : ''}
            </p>
          </div>

          {/* Visualizer */}
          <VisualizerBars isPlaying={isPlaying} />
        </div>

        {/* Sleep timer sheet */}
        {showTimer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 mb-4"
          >
            <SleepTimerSheet onSelect={setSleepMins} current={sleepMins} />
          </motion.div>
        )}

        {/* Controls */}
        <div className="px-5 pb-8 space-y-4">
          {/* Main controls */}
          <div className="flex items-center justify-center gap-6">
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center shadow-2xl',
                isPlaying
                  ? 'bg-gradient-gold-dark shadow-[0_0_40px_rgba(255,182,144,0.3)]'
                  : 'glass-card border border-white/10'
              )}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-7 h-7 text-white fill-white" />
              ) : (
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Volume */}
          <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
            <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className="text-muted-foreground/40 hover:text-foreground transition-colors flex-shrink-0">
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex-1 h-1 rounded-full bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-gold rounded-full"
                style={{ width: `${volume * 100}%` }}
                layout
                transition={{ type: 'spring', bounce: 0.1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
