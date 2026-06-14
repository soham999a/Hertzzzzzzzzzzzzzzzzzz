import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('hertz-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

function applyTheme(t: Theme, updateMeta = true) {
  const root = document.documentElement;
  if (t === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
  try { localStorage.setItem('hertz-theme', t); } catch {}
  if (updateMeta) {
    const meta = document.getElementById('theme-color') as HTMLMetaElement | null;
    if (meta) meta.content = t === 'dark' ? '#0a0a0a' : '#f5f5f0';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, tick]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setTick(x => x + 1);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return next;
    });
    setTick(x => x + 1);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
