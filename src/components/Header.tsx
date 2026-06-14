import { Radio, Heart, Globe, Crown, Podcast, Trophy, LogOut, Menu, X, Star, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AuthDialog from './AuthDialog';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: Radio },
  { href: '/favorites', label: 'Saved', icon: Heart },
  { href: '/regions', label: 'Regions', icon: Globe },
  { href: '/podcasts', label: 'Podcasts', icon: Podcast },
  { href: '/rewards', label: 'Rewards', icon: Trophy },
];

export function Header() {
  const location = useLocation();
  const { isPremium, user, signOut, rewardPoints } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) getUserProfile(user.uid).then(setProfile).catch(() => {});
    else setProfile(null);
  }, [user]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-t-0 border-l-0 border-r-0 rounded-none">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-gold-dark flex items-center justify-center shadow-[0_0_12px_rgba(255,182,144,0.2)]">
                  <Radio className="w-4 h-4 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-xl border border-primary/40"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-lg text-foreground tracking-tight">Hertz</span>
                  <span className="text-[8px] font-bold text-gradient-gold uppercase tracking-[0.15em]">Live</span>
                </div>
                <div className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide">Global Radio</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all",
                      isActive ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive && "drop-shadow-[0_0_6px_rgba(255,182,144,0.3)]")} />
                    <span className="leading-none">{item.label}</span>
                    {isActive && (
                      <motion.div layoutId="nav-indicator" className="absolute bottom-0 w-5 h-0.5 bg-gradient-gold rounded-full" />
                    )}
                  </Link>
                );
              })}

              {user && (
                isPremium ? (
                  <div className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    <Crown className="w-4 h-4" />
                    <span className="leading-none">Pro</span>
                  </div>
                ) : (
                  <Link to="/premium" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-bold text-muted-foreground/40 hover:text-primary transition-colors uppercase tracking-wider">
                    <Crown className="w-4 h-4" />
                    <span className="leading-none">Free</span>
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              {/* Upgrade button */}
              {!isPremium && user && (
                <Link to="/premium" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-gold-dark text-white text-[10px] font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,182,144,0.2)] hover:shadow-[0_0_20px_rgba(255,182,144,0.35)] transition-all transform hover:scale-105">
                  <Crown className="w-3 h-3" />
                  Upgrade
                </Link>
              )}

              <ThemeToggle />

              {/* User */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/rewards" className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {rewardPoints}
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/5 transition">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt={profile?.displayName || user.email || ''} className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-medium text-muted-foreground ring-1 ring-white/10">
                        {(profile?.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                </div>
              ) : null}

              {/* Mobile menu */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/5" aria-label="Toggle menu">
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              <AuthDialog />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-b-0 border-l-0 border-r-0 rounded-none pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href} className={cn("flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all min-w-0", isActive ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground")}>
                <div className={cn("w-10 h-8 rounded-lg flex items-center justify-center transition-colors", isActive && "bg-primary/10")}>
                  <Icon className={cn("w-5 h-5", isActive && "text-primary drop-shadow-[0_0_6px_rgba(255,182,144,0.3)]")} />
                </div>
                <span className={cn("text-[9px] font-medium leading-none truncate max-w-full", isActive ? "text-primary font-semibold" : "text-muted-foreground/50")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 glass-card border-r-0 border-b-0 border-t-0 rounded-none p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-md hover:bg-white/5"><X className="w-5 h-5" /></button>
            </div>

            {user && (
              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                  {(profile?.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{profile?.displayName || user.email?.split('@')[0]}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-white/5")}>
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Link to="/premium" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-white/5">
                <Crown className="w-5 h-5 text-amber-400" />
                {isPremium ? 'Premium Active' : 'Premium'}
                {isPremium && <span className="ml-auto text-[10px] font-bold text-amber-400">Pro</span>}
              </Link>
              <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-white/5">
                <User className="w-5 h-5" />
                Profile
              </Link>
            </div>

            {user && (
              <div className="absolute bottom-6 left-6 right-6">
                <Button variant="outline" className="w-full" onClick={() => { signOut(); setMenuOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Spacer for mobile bottom nav */}
      <div className="sm:hidden h-16" />
    </>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('theme') as 'light' | 'dark') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });

  useEffect(() => {
    if (theme === 'dark') { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [theme]);

  return (
    <button aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/5">
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  );
}
