import { useState, useEffect, useCallback, useRef } from 'react';
import wordsData from '../data/words.json';

export type GameMode = 'time' | 'zen';
export type GameStatus = 'idle' | 'typing' | 'finished';

export interface GameStats {
  wpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  extras: number;
}

const removeAccents = (str: string): string => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getRandomWords = (count: number, accents: boolean): string[] => {
  const shuffled = [...wordsData].sort(() => 0.5 - Math.random()).slice(0, count);
  return accents ? shuffled : shuffled.map(removeAccents);
};

export const useTyping = (initialTime: number, mode: GameMode, useAccents: boolean) => {
  const [words, setWords] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateText = useCallback(() => {
    const initialWords = getRandomWords(50, useAccents);
    setWords(initialWords.join(' '));
    setUserInput('');
    setStatus('idle');
    setTimeLeft(initialTime);
    startTimeRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [initialTime, useAccents]);

  useEffect(() => {
    generateText();
  }, [generateText, mode]);

  useEffect(() => {
    if (words && words.length - userInput.length < 200) {
      const extraWords = getRandomWords(50, useAccents);
      setWords((prev) => prev + ' ' + extraWords.join(' '));
    }
  }, [userInput, words, useAccents]);

  const finishGame = useCallback(() => {
    setStatus('finished');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (status === 'typing' && mode === 'time') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, mode, finishGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'finished') {
        if (e.key === 'Tab') {
          e.preventDefault();
          generateText();
        }
        return;
      }

      if (e.key === 'Escape') return generateText();
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

      if (e.key === 'Backspace') {
        setUserInput((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1) {
        if (status === 'idle') {
          setStatus('typing');
          startTimeRef.current = Date.now();
        }
        setUserInput((prev) => prev.length >= words.length ? prev : prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, words, mode, generateText, finishGame]);

  const calculateStats = (): GameStats => {
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === words[i]) correct++;
      else incorrect++;
    }

    const totalTyped = userInput.length;
    let timeElapsedInMin = 0;

    if (mode === 'time') {
      timeElapsedInMin = (initialTime - timeLeft) / 60;
    } else {
      const elapsedMs = startTimeRef.current ? (Date.now() - startTimeRef.current) : 0;
      timeElapsedInMin = elapsedMs / 60000;
    }

    const wpm = timeElapsedInMin > 0 ? Math.round((correct / 5) / timeElapsedInMin) : 0;
    const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;

    return { wpm, accuracy, correct, incorrect, extras: 0 };
  };

  return { words, userInput, status, timeLeft, stats: calculateStats(), reset: generateText };
};