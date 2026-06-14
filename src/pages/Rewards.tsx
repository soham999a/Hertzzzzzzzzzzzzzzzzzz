import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trophy, Star, Headphones, Calendar, Flame, Music2, Crown, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface RewardData {
  points: number;
  listens: number;
  lastListened?: number;
  badges?: string[];
}

const BADGE_DEFS = [
  { id: 'first_listen', label: 'First Listen', icon: Headphones, desc: 'Play your first station', require: { listens: 1 } },
  { id: 'explorer', label: 'Explorer', icon: Music2, desc: 'Listen to 10 stations', require: { listens: 10 } },
  { id: 'dedicated', label: 'Dedicated', icon: Flame, desc: 'Listen to 50 stations', require: { listens: 50 } },
  { id: 'superfan', label: 'Superfan', icon: Star, desc: 'Listen to 100 stations', require: { listens: 100 } },
  { id: 'veteran', label: 'Veteran', icon: Crown, desc: 'Listen to 500 stations', require: { listens: 500 } },
];

const POINTS_PER_LISTEN = 1;
const POINTS_FOR_FAVORITE = 5;

export default function Rewards() {
  const { user } = useAuth();
  const [reward, setReward] = useState<RewardData>({ points: 0, listens: 0, badges: [] });

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'rewards', user.uid)).then((snap) => {
      if (snap.exists()) setReward(snap.data() as RewardData);
    });
  }, [user]);

  const earnedBadges = BADGE_DEFS.filter((b) => reward.listens >= b.require.listens);
  const lockedBadges = BADGE_DEFS.filter((b) => reward.listens < b.require.listens);
  const nextBadge = lockedBadges[0];

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <Header />
        <div className="max-w-2xl mx-auto px-4 pt-20 text-center">
          <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-9 h-9 text-muted-foreground/40" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Sign in required</h1>
          <p className="text-muted-foreground/60">Please sign in to view your rewards.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 sm:pb-0">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.15em]">Rewards</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Earn points & badges</h1>
          <p className="text-sm text-muted-foreground/60 mt-1">Listen to stations and unlock achievements</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl glass-card border border-white/5 p-5 text-center">
            <Trophy className="w-7 h-7 text-amber-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{reward.points}</div>
            <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mt-1">Points</div>
          </div>
          <div className="rounded-2xl glass-card border border-white/5 p-5 text-center">
            <Headphones className="w-7 h-7 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{reward.listens}</div>
            <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mt-1">Listens</div>
          </div>
        </motion.div>

        {/* How to earn */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">How to earn</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-3 rounded-xl glass-card border border-white/5">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-primary" />
                <span className="text-sm">Listen to a station</span>
              </div>
              <span className="text-[10px] font-bold text-primary">+{POINTS_PER_LISTEN} pt</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl glass-card border border-white/5">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Favorite a station</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400">+{POINTS_FOR_FAVORITE} pts</span>
            </div>
          </div>
        </motion.section>

        {/* Badges */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">Badges</p>
          <div className="grid grid-cols-3 gap-3">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="rounded-xl glass-card border border-amber-500/20 p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-gradient-gold-dark/30 flex items-center justify-center mx-auto mb-2 shadow-[0_0_12px_rgba(255,182,144,0.1)]">
                  <badge.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-xs font-semibold text-foreground">{badge.label}</div>
                <div className="text-[9px] text-muted-foreground/50 mt-0.5">{badge.desc}</div>
              </div>
            ))}
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="rounded-xl glass-card border border-white/5 p-4 text-center opacity-40">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-4 h-4 text-muted-foreground/40" />
                </div>
                <div className="text-xs font-semibold text-muted-foreground/60">{badge.label}</div>
                <div className="text-[9px] text-muted-foreground/40 mt-0.5">{badge.desc}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Progress */}
        {nextBadge && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-2xl glass-card border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Next: {nextBadge.label}</p>
                <p className="text-[10px] text-muted-foreground/60">{reward.listens} / {nextBadge.require.listens} listens</p>
                <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-gold transition-all" style={{ width: `${Math.min(100, (reward.listens / nextBadge.require.listens) * 100)}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <AudioPlayer />
    </div>
  );
}
