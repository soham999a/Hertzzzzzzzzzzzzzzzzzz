import { useState, useEffect, useRef } from 'react';
import { X, Radio, Loader2, Search } from 'lucide-react';
import { useSearchStations } from '@/hooks/useRadioStations';
import { usePlayer } from '@/contexts/PlayerContext';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  compact?: boolean;
}

const GRADIENT_PAIRS: [string, string][] = [
  ['#ff6b35', '#ffb690'],
  ['#f7931e', '#ffd700'],
  ['#e65c00', '#f9a825'],
];

function getGradient(id: string): [string, string] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i);
  return GRADIENT_PAIRS[Math.abs(h) % GRADIENT_PAIRS.length];
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function SearchBar({ className, compact }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results, isLoading } = useSearchStations(query);
  const { play } = usePlayer();

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (station: any) => {
    play(station);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const showDropdown = isOpen && query.length >= 2;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center transition-all duration-200 rounded-2xl border",
        focused
          ? "border-primary/40 shadow-[0_0_20px_rgba(255,182,144,0.08)] bg-black/40"
          : "border-white/10 bg-black/20",
        compact ? "h-10" : "h-12"
      )}>
        <Search className={cn("absolute left-4 text-muted-foreground/50 pointer-events-none", compact ? "w-4 h-4" : "w-5 h-5")} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (e.target.value.length >= 2) setIsOpen(true); else setIsOpen(false); }}
          onFocus={() => { setFocused(true); if (query.length >= 2) setIsOpen(true); }}
          onBlur={() => setFocused(false)}
          placeholder="Search stations, genres, countries..."
          className={cn(
            "w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground/40",
            compact ? "pl-10 pr-16 text-sm" : "pl-12 pr-20 text-sm"
          )}
        />
        {!query && (
          <div className={cn("absolute right-4 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-muted-foreground/30 font-medium", compact ? "hidden" : "flex")}>
            <span className="text-[9px]">⌘</span><span>K</span>
          </div>
        )}
        {query && (
          <button onClick={() => { setQuery(''); setIsOpen(false); }} className="absolute right-4 p-1 rounded-md text-muted-foreground/40 hover:text-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 right-0 rounded-2xl overflow-hidden glass-card border border-white/10 shadow-2xl max-h-80 overflow-y-auto" style={{ zIndex: 100 }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Searching Radio Browser...</span>
            </div>
          ) : results && results.length > 0 ? (
            <div className="py-1">
              <div className="px-4 py-2 text-[10px] text-muted-foreground/50 uppercase tracking-wider border-b border-white/5">
                Found {results.length} stations
              </div>
              {results.slice(0, 8).map((station) => {
                const [g1, g2] = getGradient(station.id);
                return (
                  <button
                    key={station.id}
                    onClick={() => handleSelect(station)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/5">
                      {station.favicon ? (
                        <img src={station.favicon} alt={station.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
                          <span className="text-white font-bold text-[10px]">{getInitials(station.name)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-foreground">{station.name}</p>
                      <p className="text-xs text-muted-foreground/60 truncate">
                        {station.country}{station.language ? ` · ${station.language}` : ''}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-8 text-center">
              <Radio className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No stations found for "{query}"</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
