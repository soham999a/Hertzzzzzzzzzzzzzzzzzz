import { motion } from 'framer-motion';
import { Play, Pause, Heart, Radio, Loader2, Music2 } from 'lucide-react';
import { RadioStation } from '@/types/radio';
import { usePlayer } from '@/contexts/PlayerContext';
import { cn } from '@/lib/utils';

interface StationCardProps {
  station: RadioStation;
  index?: number;
}

const GRADIENT_PAIRS = [
  ['#ff6b35', '#ffb690'],
  ['#f7931e', '#ffd700'],
  ['#e65c00', '#f9a825'],
  ['#d84315', '#ff8a65'],
  ['#bf360c', '#ffab91'],
  ['#e65100', '#ffb74d'],
  ['#d50000', '#ff6e40'],
  ['#c43a00', '#ff9e80'],
];

function getStationGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i);
  return GRADIENT_PAIRS[Math.abs(hash) % GRADIENT_PAIRS.length];
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function StationCard({ station, index = 0 }: StationCardProps) {
  const { play, pause, isPlaying, currentStation, isLoading, isFavorite, toggleFavorite } = usePlayer();

  const isCurrentStation = currentStation?.id === station.id;
  const isCurrentlyPlaying = isCurrentStation && isPlaying;
  const isCurrentlyLoading = isCurrentStation && isLoading;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) pause();
    else play(station);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(station);
  };

  const [g1, g2] = getStationGradient(station.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-all duration-300",
        "glass-card hover:border-primary/25",
        isCurrentStation && "border-primary/40 gold-glow"
      )}
    >
      {/* Active playing indicator */}
      {isCurrentStation && isPlaying && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-gold" />
      )}

      <div className="p-3.5 flex items-center gap-3.5">
        {/* Station Icon - Gradient Circle */}
        <div className="relative flex-shrink-0">
          {station.favicon ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/10">
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
              <span className="text-white font-bold text-sm tracking-tight">{getInitials(station.name)}</span>
            </div>
          )}

          {/* Play overlay on hover */}
          <button
            onClick={handlePlayClick}
            className={cn(
              "absolute inset-0 w-full h-full rounded-2xl flex items-center justify-center transition-all duration-200",
              isCurrentStation
                ? "bg-black/20 backdrop-blur-sm"
                : "bg-black/0 opacity-0 group-hover:opacity-100 group-hover:bg-black/30 group-hover:backdrop-blur-sm"
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
                {isCurrentStation && (
                  <span className="live-badge flex-shrink-0">Live</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                <span>{station.country}</span>
                {station.language && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span>{station.language}</span>
                  </>
                )}
              </p>
            </div>

            <button
              onClick={handleFavoriteClick}
              className="p-1.5 rounded-full hover:bg-white/5 transition-colors flex-shrink-0 -mr-1 -mt-1"
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-all",
                  isFavorite(station.id)
                    ? "text-red-400 fill-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]"
                    : "text-muted-foreground/40 hover:text-red-400"
                )}
              />
            </button>
          </div>

          {/* Tags */}
          {station.tags && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {station.tags.split(',').slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground font-medium border border-white/5"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Waveform bar when active */}
      {isCurrentStation && isPlaying && (
        <div className="px-3.5 pb-3">
          <div className="flex items-center gap-[2px] h-5">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-full bg-gradient-gold"
                animate={{
                  height: [2, 6, 12, 6, 2, 8, 4, 10, 2, 6, 12, 6, 4, 8, 2, 6][i % 16] + 'px'
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.3,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  delay: i * 0.07,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
