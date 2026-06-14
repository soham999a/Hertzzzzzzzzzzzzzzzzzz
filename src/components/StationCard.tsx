import { motion } from 'framer-motion';
import { Play, Pause, Heart, Radio, Loader2 } from 'lucide-react';
import { RadioStation } from '@/types/radio';
import { usePlayer } from '@/contexts/PlayerContext';
import { cn } from '@/lib/utils';

interface StationCardProps {
  station: RadioStation;
  index?: number;
}

const GRADIENT_PAIRS: [string, string][] = [
  ['#ff6b35', '#ffb690'],
  ['#f7931e', '#ffd700'],
  ['#e65c00', '#f9a825'],
  ['#d84315', '#ff8a65'],
  ['#bf360c', '#ffab91'],
  ['#e65100', '#ffb74d'],
  ['#d50000', '#ff6e40'],
  ['#c43a00', '#ff9e80'],
];

function getGradient(id: string): [string, string] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i);
  return GRADIENT_PAIRS[Math.abs(h) % GRADIENT_PAIRS.length];
}

function getInitials(name: string) { return name.slice(0, 2).toUpperCase(); }

export function StationCard({ station, index = 0 }: StationCardProps) {
  const { play, pause, isPlaying, currentStation, isLoading, isFavorite, toggleFavorite } = usePlayer();

  const isCurrentStation = currentStation?.id === station.id;
  const isCurrentlyPlaying = isCurrentStation && isPlaying;
  const isCurrentlyLoading = isCurrentStation && isLoading;
  const favorited = isFavorite(station.id);
  const [g1, g2] = getGradient(station.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) pause();
    else play(station);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(station);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-300',
        'glass-card glass-card-hover',
        isCurrentStation && 'border-primary/30 gold-glow'
      )}
    >
      {/* Playing indicator */}
      {isCurrentlyPlaying && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-gold z-10" />
      )}

      <div className="p-4 flex items-center gap-3.5">
        {/* Icon */}
        <div className="relative flex-shrink-0">
          {station.favicon ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-white/10">
              <img
                src={station.favicon}
                alt={station.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
            >
              <span className="text-white font-bold text-sm tracking-tight drop-shadow-sm">
                {getInitials(station.name)}
              </span>
            </div>
          )}

          {/* Play overlay */}
          <button
            onClick={handlePlay}
            className={cn(
              'absolute inset-0 w-full h-full rounded-2xl flex items-center justify-center transition-all duration-200',
              isCurrentStation
                ? 'bg-black/20 backdrop-blur-sm'
                : 'opacity-0 group-hover:opacity-100 bg-black/0 group-hover:bg-black/30 group-hover:backdrop-blur-sm'
            )}
          >
            {isCurrentlyLoading ? (
              <Loader2 className="w-6 h-6 text-white drop-shadow-lg animate-spin" />
            ) : isCurrentlyPlaying ? (
              <Pause className="w-6 h-6 text-white drop-shadow-lg fill-white" />
            ) : (
              <Play className="w-6 h-6 text-white drop-shadow-lg fill-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground truncate leading-tight">
                  {station.name}
                </h3>
                {isCurrentStation && <span className="live-badge flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground/60 truncate mt-0.5 flex items-center gap-1">
                <span>{station.country}</span>
                {station.language && (
                  <>
                    <span className="text-muted-foreground/30">·</span>
                    <span>{station.language}</span>
                  </>
                )}
              </p>
            </div>

            <button
              onClick={handleFavorite}
              className="p-1.5 rounded-full hover:bg-white/5 transition-colors flex-shrink-0 -mr-1 -mt-1"
            >
              <Heart
                className={cn(
                  'w-4 h-4 transition-all duration-200',
                  favorited
                    ? 'text-red-400 fill-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]'
                    : 'text-muted-foreground/30 hover:text-red-400/70'
                )}
              />
            </button>
          </div>

          {/* Tags */}
          {station.tags && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {station.tags.split(',').slice(0, 3).map((tag, i) => (
                <span key={i} className="tag-pill">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Waveform */}
      {isCurrentlyPlaying && (
        <div className="px-4 pb-3.5">
          <div className="flex items-center gap-[2px] h-5">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-full bg-gradient-gold"
                animate={{
                  height: [
                    2, 8, 14, 8, 2, 10, 18, 10, 2, 8, 14, 8, 2, 10, 18, 10
                  ][i % 16] + 2 + 'px',
                }}
                transition={{
                  duration: 0.6 + Math.random() * 0.3,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  delay: i * 0.06,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
