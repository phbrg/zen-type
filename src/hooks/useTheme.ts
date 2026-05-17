import { useState, useEffect } from 'react';

const THEMES: Record<string, { bg: string; text: string; primary: string; error: string }> = {
  dark: { bg: '#111111', text: '#646669', primary: '#d1d0c5', error: '#ca4754' },
  dracula: { bg: '#282a36', text: '#6272a4', primary: '#f8f8f2', error: '#ff5555' },
  matcha: { bg: '#e2ebd9', text: '#8da37a', primary: '#2e3d24', error: '#e95f5f' },
};

export const useTheme = () => {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    const colors = THEMES[theme] || THEMES.dark;
    
    root.style.setProperty('--color-bg', colors.bg);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-error', colors.error);

    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme, availableThemes: Object.keys(THEMES) };
};