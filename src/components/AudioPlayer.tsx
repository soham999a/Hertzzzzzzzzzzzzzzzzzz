import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Radio, Loader2, Heart } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const EQ_BARS = 32;
const EQ_COLORS = [
  'bg-gradient-gold opacity-70',
  'bg-gradient-gold opacity-60',
  'bg-gradient-gold opacity-50',
  'bg-gradient-gold opacity-40',
];

export function AudioPlayer() {
  const {
    currentStation,
    isPlaying,
    isLoading,
    volume,
    togglePlayPause,
    setVolume,
    stop,
    isFavorite,
    toggleFavorite,
    favorites,
  } = usePlayer();

  const favorited = currentStation ? isFavorite(currentStation.id) : false;

  return (
    <AnimatePresence>
      {currentStation && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          {/* Ambient glow above player */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-gold/10 blur-3xl rounded-full pointer-events-none" />

          {/* Gold accent line */}
          <div className="relative">
            <div className="gold-bar w-full" />
            <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-gold/30 blur-sm rounded-full" />
          </div>

          <div className="glass-card border-t-0 rounded-none">
            {/* Equalizer strip */}
            {isPlaying && (
              <div className="flex items-end gap-[2px] h-7 px-4 pt-2.5 overflow-hidden">
                {Array.from({ length: EQ_BARS }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      'flex-1 rounded-full',
                      EQ_COLORS[i % EQ_COLORS.length]
                    )}
                    animate={{
                      height: [
                        `${8 + Math.random() * 24}%`,
                        `${12 + Math.random() * 52}%`,
                        `${6 + Math.random() * 36}%`,
                        `${14 + Math.random() * 44}%`,
                        `${8 + Math.random() * 24}%`,
                      ],
                    }}
                    transition={{
                      duration: 0.35 + Math.random() * 0.4,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      delay: i * 0.025,
                      ease: 'easeInOut',
                    }}
                    style={{ height: '18%' }}
                  />
                ))}
              </div>
            )}

            {/* Main content */}
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Station icon with live ring */}
                <div className="relative w-12 h-12 flex-shrink-0">
                  <div className="w-full h-full rounded-xl overflow-hidden ring-1 ring-white/10">
                    {currentStation.favicon ? (
                      <img
                        src={currentStation.favicon}
                        alt={currentStation.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/10">
                        <Radio className="w-5 h-5 text-primary/60" />
                      </div>
                    )}
                  </div>
                  {isPlaying && (
                    <motion.div
                      className="absolute -inset-1 rounded-xl border border-primary/30"
                      animate={{ opacity: [0.4, 0.1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Station info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn(
                      'text-[8px] font-bold uppercase tracking-[0.15em]',
                      isPlaying ? 'text-primary' : 'text-muted-foreground/50'
                    )}>
                      {isLoading ? 'Buffering...' : isPlaying ? 'Now Playing' : 'Paused'}
                    </span>
                    {isPlaying && <span className="live-dot" />}
                  </div>
                  <h4 className="font-bold text-sm text-foreground truncate leading-tight">
                    {currentStation.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground/50 truncate">
                    {currentStation.country}{currentStation.language ? ` · ${currentStation.language}` : ''}
                  </p>
                </div>

                {/* Favorite */}
                <button
                  onClick={() => currentStation && toggleFavorite(currentStation)}
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/5 transition-all flex-shrink-0"
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 transition-all',
                      favorited ? 'text-red-400 fill-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.3)]' : 'text-muted-foreground/30 hover:text-red-400'
                    )}
                  />
                </button>

                {/* Skip Back */}
                <button className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-white/5 transition-all flex-shrink-0">
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Play/Pause */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlayPause}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0',
                    isPlaying
                      ? 'bg-gradient-gold-dark shadow-[0_0_24px_rgba(255,182,144,0.25)]'
                      : 'glass-card hover:bg-white/10 border border-white/10'
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 text-white fill-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  )}
                </motion.button>

                {/* Skip Forward */}
                <button className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-white/5 transition-all flex-shrink-0">
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Volume */}
                <div className="hidden md:flex items-center gap-2 w-28">
                  <button
                    onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                    className="text-muted-foreground/40 hover:text-foreground transition-colors flex-shrink-0"
                  >
                    {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <Slider
                    value={[volume * 100]}
                    onValueChange={([v]) => setVolume(v / 100)}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>

                {/* Close */}
                <button
                  onClick={stop}
                  className="p-1.5 rounded-full hover:bg-white/5 transition-colors text-muted-foreground/30 hover:text-foreground flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
