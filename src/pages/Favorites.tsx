import { motion } from 'framer-motion';
import { Heart, Radio, Crown, Star } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { StationCard } from '@/components/StationCard';
import { Header } from '@/components/Header';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites, isPremium, favoritesLimit, favoritesRemaining } = usePlayer();

  return (
    <div className="min-h-screen bg-background pb-28 sm:pb-0">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Saved</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-foreground">My Stations</h1>
            {!isPremium && (
              <div className="text-xs text-muted-foreground/60">{favorites.length}/{favoritesLimit} saved</div>
            )}
          </div>
          <div className="gold-bar mt-3 w-16" />
        </motion.div>

        {/* Limit Warning */}
        {!isPremium && favorites.length >= favoritesLimit - 1 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl glass-card border border-amber-500/20">
            <div className="flex items-start gap-2">
              <Crown className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-foreground font-medium">
                  {favoritesRemaining === 0 ? 'Favorites limit reached!' : `Only ${favoritesRemaining} slot remaining`}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                  <Link to="/premium" className="text-primary hover:underline">Upgrade to Pro</Link> for unlimited favorites
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* List */}
        {favorites.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {favorites.map((station, index) => (
              <StationCard key={station.id} station={station} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mb-5">
              <Radio className="w-9 h-9 text-muted-foreground/30" />
            </div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-sm text-muted-foreground/60 text-center max-w-xs">
              Tap the heart icon on any station to save it here for quick access.
            </p>
          </motion.div>
        )}
      </main>

      <AudioPlayer />
    </div>
  );
}
