import { motion } from 'framer-motion';
import { Radio, Loader2 } from 'lucide-react';
import { useStationsByRegion } from '@/hooks/useRadioStations';
import { StationCard } from './StationCard';
import { REGIONS } from '@/types/radio';

interface StationGridProps {
  regionId: string;
}

export function StationGrid({ regionId }: StationGridProps) {
  const { data: stations, isLoading, error } = useStationsByRegion(regionId);
  const region = REGIONS.find(r => r.id === regionId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl glass-card p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
                <div className="flex gap-1.5 mt-2">
                  <div className="h-3 bg-white/5 rounded-full w-12" />
                  <div className="h-3 bg-white/5 rounded-full w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-4">
          <Radio className="w-7 h-7 text-muted-foreground/60" />
        </div>
        <p className="text-muted-foreground font-medium">Failed to load stations</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Check your connection and try again</p>
      </div>
    );
  }

  if (!stations || stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-4">
          <Radio className="w-7 h-7 text-muted-foreground/60" />
        </div>
        <p className="text-muted-foreground font-medium">No stations found</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Try selecting a different region</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      {stations.map((station, index) => (
        <StationCard key={station.id} station={station} index={index} />
      ))}
    </motion.div>
  );
}
