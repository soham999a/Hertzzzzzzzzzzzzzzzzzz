import { motion } from 'framer-motion';
import { Heart, Lock, Music } from 'lucide-react';
import { StationCard } from '@/components/StationCard';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { NavLink } from 'react-router-dom';

export default function Favorites() {
  const { user } = useAuth();
  const { favorites } = usePlayer();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 md:p-10 text-center max-w-sm mx-auto mx-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary/60" />
          </div>
          <h2 className="font-bold text-lg text-foreground mb-1">Sign in required</h2>
          <p className="text-sm text-muted-foreground/60 mb-4 text-pretty">
            Sign in to save your favorite stations and access them across devices.
          </p>
          <NavLink
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/15 transition-colors"
          >
            Back to Explore
          </NavLink>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-4 pb-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gradient-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-medium mb-4"
          >
            <Heart className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary/80">Your Collection</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground"
          >
            Favorites
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground/60 mt-1"
          >
            {favorites.length} {favorites.length === 1 ? 'station' : 'stations'} saved
          </motion.p>
        </div>

        {/* Limit warning */}
        {favorites.length >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4 mb-5 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-gold/15 flex items-center justify-center flex-shrink-0">
              <Music className="w-4.5 h-4.5 text-primary" style={{ width: 18, height: 18 }} />
            </div>
            <p className="text-xs text-muted-foreground/70">
              Upgrade to Premium for unlimited favorites, HD audio, and an ad-free experience.
            </p>
            <NavLink
              to="/premium"
              className="text-xs font-bold text-primary whitespace-nowrap hover:underline"
            >
              Upgrade
            </NavLink>
          </motion.div>
        )}

        {/* List */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-10 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-primary/40" />
            </div>
            <h3 className="font-bold text-base text-foreground mb-1">No favorites yet</h3>
            <p className="text-sm text-muted-foreground/60 text-pretty max-w-xs mx-auto">
              Tap the heart icon on any station to save it here for quick access.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {favorites.map((station, i) => (
              <StationCard key={station.id} station={station} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
