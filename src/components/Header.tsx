import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Radio, Sparkles, Heart, Trophy, Podcast, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/ThemeProvider';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: 'Explore', icon: Radio },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/rewards', label: 'Rewards', icon: Trophy },
  { path: '/podcasts', label: 'Podcasts', icon: Podcast },
  { path: '/premium', label: 'Premium', icon: Sparkles },
];

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-40">
        <div className="relative">
          <div className="gold-bar w-full" />
          <div className="glass-card rounded-none border-t-0 border-x-0">
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
              {/* Logo */}
              <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="relative w-8 h-8">
                  <div className="w-full h-full rounded-lg bg-gradient-gold flex items-center justify-center shadow-[0_0_20px_rgba(255,182,144,0.2)]">
                    <Radio className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                  </div>
                  <motion.div
                    className="absolute -inset-1 rounded-lg border border-primary/30"
                    animate={{ opacity: [0.4, 0.1, 0.4], scale: [1, 1.04, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-foreground">
                    Hertz
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
              </NavLink>

              {/* Nav */}
              <nav className="flex items-center gap-1">
                {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <NavLink
                      key={path}
                      to={path}
                      className={cn(
                        'relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground/50 hover:text-foreground hover:bg-white/5'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-xl bg-white/6"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                        />
                      )}
                      <Icon className={cn('w-3.5 h-3.5 relative', isActive && 'drop-shadow-[0_0_6px_rgba(255,182,144,0.2)]')} />
                      <span className="relative">{label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  const root = document.documentElement;
                  const isDark = root.classList.contains('dark');
                  root.classList.toggle('dark');
                  localStorage.setItem('hertz-theme', isDark ? 'light' : 'dark');
                }}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground/50 hover:text-foreground flex-shrink-0"
                aria-label="Toggle theme"
              >
                <Sun className="w-4 h-4 hidden dark:block" />
                <Moon className="w-4 h-4 block dark:hidden" />
              </button>

              {/* Auth */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground/50 truncate max-w-[100px]">
                      {user.email}
                    </span>
                    <button
                      onClick={signOut}
                      className="text-xs text-muted-foreground/40 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground/40">
                    Guest
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40">
        <div className="gold-bar w-full" />
        <div className="glass-card rounded-none border-t-0 border-x-0">
          <div className="px-4 h-12 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-gold flex items-center justify-center shadow-[0_0_14px_rgba(255,182,144,0.15)]">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-foreground">Hertz</span>
            </NavLink>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Menu className="w-4.5 h-4.5 text-muted-foreground/70" style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-[260px] z-50 glass-card rounded-none border-r-0"
            >
              <div className="flex items-center justify-between px-4 h-12 border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground/70" />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <NavLink
                      key={path}
                      to={path}
                      className={cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground/50 hover:text-foreground hover:bg-white/5'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', isActive && 'drop-shadow-[0_0_6px_rgba(255,182,144,0.2)]')} />
                      {label}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                <span className="text-xs text-muted-foreground/30">
                  {user ? user.email : 'Guest'}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-12 md:h-14" />
    </>
  );
}
