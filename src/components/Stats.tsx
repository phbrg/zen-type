import React from 'react';
import type { GameStats } from '../hooks/useTyping';

interface StatsProps {
  stats: GameStats;
  reset: () => void;
}

// @ts-ignore
const Stats: React.FC<StatsProps> = ({ stats, reset }) => {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-in w-full max-w-3xl">
      <div className="grid grid-cols-2 gap-8 w-full text-left mb-12">
        <div className="flex flex-col">
          <span className="text-[var(--color-text)] text-3xl">wpm</span>
          <span className="text-[var(--color-primary)] text-7xl font-bold">{stats.wpm}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[var(--color-text)] text-3xl">acurácia</span>
          <span className="text-[var(--color-primary)] text-7xl font-bold">{stats.accuracy}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 w-full text-left border-t border-[var(--color-text)]/20 pt-6">
        <div>
          <span className="text-[var(--color-text)] text-lg block">caracteres</span>
          <div className="text-xl font-mono mt-1">
            <span className="text-[var(--color-primary)]">{stats.correct}</span>
            <span className="text-[var(--color-text)] mx-1">/</span>
            <span className="text-[var(--color-error)]">{stats.incorrect}</span>
          </div>
        </div>
      </div>

      <div className="mt-12 text-[var(--color-text)] text-sm animate-pulse">
        pressione <kbd className="bg-[var(--color-text)]/20 px-2 py-1 rounded">Tab</kbd> para recomeçar
      </div>
    </div>
  );
};

export default Stats;