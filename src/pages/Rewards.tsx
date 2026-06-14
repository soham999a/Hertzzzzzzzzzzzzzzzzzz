import { motion } from 'framer-motion';
import { Trophy, Headphones, Heart, Zap, Star, Clock, Radio } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const BADGES = [
  { id: 'first_listen', name: 'First Listen', icon: Headphones, desc: 'Listen to your first station' },
  { id: 'explorer', name: 'Explorer', icon: Radio, desc: 'Try stations from 3 regions' },
  { id: 'collector', name: 'Collector', icon: Heart, desc: 'Save 10 favorite stations' },
  { id: 'dedicated', name: 'Dedicated', icon: Clock, desc: 'Listen for 10 hours total' },
  { id: 'superfan', name: 'Superfan', icon: Star, desc: 'Listen for 50 hours total' },
  { id: 'globetrotter', name: 'Globetrotter', icon: Zap, desc: 'Try stations from every region' },
];

export default function Rewards() {
  const { user } = useAuth();
  const { favorites } = usePlayer();

  const STATS = [
    { label: 'Favorites', value: favorites.length.toLocaleString(), icon: Headphones },
    { label: 'Listening Time', value: '0h 0m', icon: Clock },
    { label: 'Badges', value: `0 / ${BADGES.length}`, icon: Trophy },
  ];

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 md:p-10 text-center max-w-sm mx-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-primary/60" />
          </div>
          <h2 className="font-bold text-lg text-foreground mb-1">Sign in required</h2>
          <p className="text-sm text-muted-foreground/60 mb-4 text-pretty">
            Sign in to track your listening stats and earn badges.
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
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary/80">Your Achievements</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground"
          >
            Rewards
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground/60 mt-1"
          >
            Listen more, earn badges, unlock prestige
          </motion.p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {STATS.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card rounded-2xl p-4"
            >
              <Icon className="w-4 h-4 text-primary/50 mb-2" />
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="font-bold text-sm text-foreground mb-3">Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BADGES.map((badge, i) => {
              const earned = false;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className={cn(
                    'glass-card rounded-2xl p-4 flex items-start gap-3 transition-all duration-300',
                    earned ? 'gold-glow border-primary/15' : 'opacity-50 hover:opacity-70'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      earned ? 'bg-gradient-gold/20' : 'bg-white/5'
                    )}
                  >
                    <badge.icon
                      className={cn(
                        'w-5 h-5',
                        earned ? 'text-primary drop-shadow-[0_0_6px_rgba(255,182,144,0.3)]' : 'text-muted-foreground/30'
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={cn('font-bold text-xs', earned ? 'text-foreground' : 'text-muted-foreground/50')}>
                        {badge.name}
                      </h4>
                      {earned && (
                        <span className="text-[8px] font-bold text-primary uppercase tracking-wider">Earned</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground/40 mt-0.5">{badge.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
