import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Radio, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { StationCard } from '@/components/StationCard';
import { StationGrid } from '@/components/StationGrid';
import { SearchBar } from '@/components/SearchBar';
import { RegionTabs } from '@/components/RegionTabs';
import { useStations } from '@/hooks/useStations';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { cn } from '@/lib/utils';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const { stations, isLoading } = useStations(selectedRegion);

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return stations;
    const q = searchQuery.toLowerCase();
    return stations.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.country?.toLowerCase().includes(q) ||
        s.language?.toLowerCase().includes(q) ||
        s.tags?.toLowerCase().includes(q)
    );
  }, [stations, searchQuery]);

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-8 pb-6 md:pt-12 md:pb-10">
        {/* Big ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] md:w-[700px] h-[300px] md:h-[400px] bg-gradient-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute top-5 right-1/4 w-60 h-60 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-medium mb-4"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(255,182,144,0.5)]" />
              <span className="text-primary/80">
                {stations.length.toLocaleString()} radio stations
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight text-balance leading-[1.08] mb-2"
            >
              <span className="text-foreground">Discover </span>
              <span className="text-gradient-gold">radio</span>
              <br className="md:hidden" />
              <span className="text-foreground"> that moves you</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm md:text-base text-muted-foreground/60 max-w-md mx-auto leading-relaxed text-pretty"
            >
              Stream thousands of stations from every corner of the world.
              Curated, crystal-clear, completely free.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Search + Controls ── */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="flex-1">
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <div className="flex-shrink-0 overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
            <RegionTabs selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
          </div>
        </motion.div>
      </section>

      {/* ── Station List ── */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-20 md:pb-24">
        {searchQuery.trim() ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StationGrid stations={filteredStations} isLoading={isLoading} />
              {!isLoading && filteredStations.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground/40 text-center py-16"
                >
                  No stations found for &ldquo;{searchQuery}&rdquo;
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <StationGrid stations={filteredStations} isLoading={isLoading} />
        )}

        {/* Premium CTA */}
        {filteredStations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <NavLink
              to="/premium"
              className="group relative block overflow-hidden rounded-2xl glass-card p-5 md:p-6 transition-all duration-300 hover:border-primary/20 gold-glow"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-gold/20" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-gold/15 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Go Premium</h4>
                    <p className="text-xs text-muted-foreground/50 mt-0.5">
                      Unlimited favorites, HD audio, zero ads, all regions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary/80 group-hover:text-primary transition-colors">
                  <span className="text-xs font-bold hidden sm:inline">Upgrade</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </NavLink>
          </motion.div>
        )}
      </section>

      {/* ── Playing Now Indicator (bottom spacer) ── */}
      <div className="h-20 md:h-16" />
    </main>
  );
}
