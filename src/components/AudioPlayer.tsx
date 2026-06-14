import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Radio, Loader2 } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export function AudioPlayer() {
  const {
    currentStation,
    isPlaying,
    isLoading,
    volume,
    togglePlayPause,
    setVolume,
    stop
  } = usePlayer();

  return (
    <AnimatePresence>
      {currentStation && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.12, duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          {/* Gold accent top glow line */}
          <div className="relative">
            <div className="gold-bar w-full" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gradient-gold/20 blur-xl rounded-full" />
          </div>

          <div className="glass-card border-t-0 rounded-none">
            {/* Waveform strip */}
            {isPlaying && (
              <div className="flex items-end gap-[2px] h-6 px-4 pt-2 overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-full bg-gradient-gold opacity-60"
                    animate={{ height: [`${Math.random() * 60 + 15}%`, `${Math.random() * 60 + 15}%`] }}
                    transition={{
                      duration: 0.35 + Math.random() * 0.35,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      delay: i * 0.015,
                    }}
                    style={{ height: '25%' }}
                  />
                ))}
              </div>
            )}

            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Station Icon */}
                <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                  {currentStation.favicon ? (
                    <img
                      src={currentStation.favicon}
                      alt={currentStation.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/25 to-secondary/10">
                      <Radio className="w-5 h-5 text-primary/60" />
                    </div>
                  )}
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-xl ring-1 ring-primary/40 animate-pulse-glow pointer-events-none" />
                  )}
                </div>

                {/* Station Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="live-dot" />
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Live</span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground truncate leading-tight">
                    {currentStation.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {currentStation.country}{currentStation.language ? ` · ${currentStation.language}` : ''}
                  </p>
                </div>

                {/* Skip Back */}
                <button className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex-shrink-0">
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Play/Pause */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlayPause}
                  className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                    isPlaying
                      ? "bg-gradient-gold-dark shadow-[0_0_20px_rgba(255,182,144,0.25)]"
                      : "glass-card hover:bg-white/10"
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
                <button className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex-shrink-0">
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Volume */}
                <div className="hidden sm:flex items-center gap-2 w-28">
                  <button
                    onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    {volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
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
                  className="p-1.5 rounded-full hover:bg-white/5 transition-colors text-muted-foreground/60 hover:text-foreground flex-shrink-0"
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
