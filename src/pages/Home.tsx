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
  
  const { words, userInput, status, timeLeft, stats, reset } = useTyping(time, mode, useAccents);

  useEffect(() => {
    localStorage.setItem('mode', mode);
    localStorage.setItem('time', time.toString());
    localStorage.setItem('useAccents', JSON.stringify(useAccents));
  }, [mode, time, useAccents]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center px-8 pb-16 font-mono transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-5xl flex flex-col flex-grow">
        <Header 
          mode={mode} setMode={setMode}
          time={time} setTime={setTime}
          useAccents={useAccents} setUseAccents={setUseAccents}
          theme={theme} setTheme={setTheme} availableThemes={availableThemes}
        />
        
        <main className="flex-grow flex items-center justify-center mt-12 w-full">
          {status === 'finished' ? (
            <Stats stats={stats} reset={reset} />
          ) : (
            <TypingArea 
              words={words} 
              userInput={userInput} 
              timeLeft={timeLeft}
              mode={mode}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;