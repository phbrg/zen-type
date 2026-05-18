import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TypingArea from '../components/TypingArea';
import Stats from '../components/Stats';
import { useTyping } from '../hooks/useTyping';
import type { GameMode } from '../hooks/useTyping';
import { useTheme } from '../hooks/useTheme';

const Home: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(() => (localStorage.getItem('mode') as GameMode) || 'time');
  const [time, setTime] = useState<number>(() => Number(localStorage.getItem('time')) || 30);
  const [useAccents, setUseAccents] = useState<boolean>(() => {
    const saved = localStorage.getItem('useAccents');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const { theme, setTheme, availableThemes } = useTheme();
  
  const { words, userInput, status, timeLeft, stats, reset, isInactive } = useTyping(time, mode, useAccents);

  useEffect(() => {
    localStorage.setItem('mode', mode);
    localStorage.setItem('time', time.toString());
    localStorage.setItem('useAccents', JSON.stringify(useAccents));
  }, [mode, time, useAccents]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center px-4 md:px-6 font-mono transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-6xl flex flex-col flex-grow">
        <Header 
          mode={mode} setMode={setMode}
          time={time} setTime={setTime}
          useAccents={useAccents} setUseAccents={setUseAccents}
          theme={theme} setTheme={setTheme} availableThemes={availableThemes}
        />
        
        <main className="flex-grow flex flex-col items-center justify-center w-full">
          {status === 'finished' ? (
            <Stats stats={stats} reset={reset} />
          ) : (
            <div className="w-full flex flex-col items-center relative">
              <TypingArea 
                words={words} 
                userInput={userInput} 
                timeLeft={timeLeft}
                mode={mode}
              />

              <div 
                className={`mt-10 transition-opacity duration-500 absolute -bottom-16 ${
                  status === 'idle' || isInactive
                    ? 'opacity-100' 
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <button 
                  onClick={reset}
                  className="text-[var(--color-text)] text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-[var(--color-primary)] transition-colors outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  pressione <kbd className="bg-[var(--color-text)]/20 px-2 py-0.5 rounded text-xs font-sans border border-[var(--color-text)]/30">esc</kbd> para reiniciar
                </button>
              </div>
            </div>
          )}
        </main>
        
        <footer className="w-full flex justify-center items-center py-8 mt-auto text-sm">
          <a 
            href="https://github.com/phbrg/zen-type"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors opacity-80 hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="font-medium">Projeto open source no GitHub</span>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Home;