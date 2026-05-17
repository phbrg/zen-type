import React from 'react';
import type { GameMode } from '../hooks/useTyping';

interface HeaderProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  time: number;
  setTime: (time: number) => void;
  useAccents: boolean;
  setUseAccents: (val: boolean) => void;
  theme: string;
  setTheme: (theme: string) => void;
  availableThemes: string[];
}

const Header: React.FC<HeaderProps> = ({ 
  mode, setMode, 
  time, setTime, 
  useAccents, setUseAccents, 
  theme, setTheme, availableThemes 
}) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full py-8 text-[var(--color-text)] select-none">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <span className="text-2xl font-bold text-[var(--color-primary)]">zen type</span>
      </div>

      <nav className="flex gap-6 bg-[var(--color-text)]/10 px-4 py-2 rounded-lg text-sm">
        <div className="flex gap-4 border-r border-[var(--color-text)]/30 pr-4">
          <button 
            className={`transition-colors hover:text-[var(--color-primary)] ${mode === 'time' ? 'text-[var(--color-primary)]' : ''}`}
            onClick={() => setMode('time')}
          >
            tempo
          </button>
          <button 
            className={`transition-colors hover:text-[var(--color-primary)] ${mode === 'zen' ? 'text-[var(--color-primary)]' : ''}`}
            onClick={() => setMode('zen')}
          >
            zen
          </button>
        </div>

        {mode === 'time' && (
          <div className="flex gap-4 border-r border-[var(--color-text)]/30 pr-4">
            {[15, 30, 60].map(t => (
              <button 
                key={t}
                className={`transition-colors hover:text-[var(--color-primary)] ${time === t ? 'text-[var(--color-primary)]' : ''}`}
                onClick={() => setTime(t)}
              >
                {t}s
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <button 
            className={`transition-colors hover:text-[var(--color-primary)] ${useAccents ? 'text-[var(--color-primary)]' : ''}`}
            onClick={() => setUseAccents(!useAccents)}
          >
            {useAccents ? '@acentos' : 'sem acentos'}
          </button>
        </div>
      </nav>

      <div className="mt-4 md:mt-0">
        <select 
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-transparent text-[var(--color-text)] outline-none cursor-pointer hover:text-[var(--color-primary)] transition-colors"
        >
          {availableThemes.map(t => (
            <option key={t} value={t} className="bg-[var(--color-bg)]">{t}</option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;