import { motion, LayoutGroup } from 'framer-motion';
import { Crown } from 'lucide-react';
import { REGIONS, Region } from '@/types/radio';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RegionTabsProps {
  selectedRegion: string;
  onSelectRegion: (regionId: string) => void;
}

export function RegionTabs({ selectedRegion, onSelectRegion }: RegionTabsProps) {
  const { isPremium } = useAuth();

  const handleRegionClick = (region: Region) => {
    if (region.premium && !isPremium) {
      toast.error('Premium region', {
        description: 'Upgrade to access all regions worldwide!',
        action: { label: 'Upgrade', onClick: () => window.location.href = '/premium' }
      });
      return;
    }
    onSelectRegion(region.id);
  };

  return (
    <LayoutGroup>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        {REGIONS.map((region) => {
          const isSelected = selectedRegion === region.id;
          const isLocked = region.premium && !isPremium;

          return (
            <motion.button
              key={region.id}
              layout
              whileTap={{ scale: 0.96 }}
              onClick={() => handleRegionClick(region)}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                isSelected
                  ? "bg-gradient-gold-dark text-white border-transparent shadow-[0_0_16px_rgba(255,182,144,0.2)]"
                  : "glass-card text-muted-foreground border-white/5 hover:border-primary/25 hover:text-foreground",
                isLocked && "opacity-50"
              )}
            >
              <span>{region.emoji}</span>
              <span>{region.name}</span>
              {isLocked && <Crown className="w-3 h-3 text-amber-400" />}
              {isSelected && (
                <motion.div
                  layoutId="region-bg"
                  className="absolute inset-0 rounded-full bg-gradient-gold-dark"
                  style={{ zIndex: -1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
