import React, { useMemo, useRef, useEffect, useState } from 'react';
import type { GameMode } from '../hooks/useTyping';

interface TypingAreaProps {
  words: string;
  userInput: string;
  timeLeft: number;
  mode: GameMode;
}

const TypingArea: React.FC<TypingAreaProps> = ({ words, userInput, timeLeft, mode }) => {
  const wordsData = useMemo(() => {
    const wordArray = words.split(' ');
    let currentIndex = 0;
    return wordArray.map((word, i) => {
      const startIndex = currentIndex;
      const endIndex = currentIndex + word.length;
      currentIndex = endIndex + 1;
      return { id: i, word, startIndex, endIndex };
    });
  }, [words]);

  const activeWordIndex = useMemo(() => userInput.split(' ').length - 1, [userInput]);
  const [firstVisibleWordIndex, setFirstVisibleWordIndex] = useState<number>(0);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (userInput.length === 0) {
      setFirstVisibleWordIndex(0);
    }
  }, [userInput.length]);

  useEffect(() => {
    const activeWordEl = wordRefs.current[activeWordIndex];
    const firstVisibleEl = wordRefs.current[firstVisibleWordIndex];

    if (!activeWordEl || !firstVisibleEl) return;

    const firstLineY = firstVisibleEl.offsetTop;
    
    let lineCount = 1;
    let currentY = firstLineY;
    
    for (let i = firstVisibleWordIndex; i <= activeWordIndex; i++) {
      const el = wordRefs.current[i];
      if (el && el.offsetTop > currentY + 15) {
        lineCount++;
        currentY = el.offsetTop;
      }
    }

    if (lineCount >= 3) {
      let newFirstIndex = firstVisibleWordIndex;
      for (let i = firstVisibleWordIndex; i <= activeWordIndex; i++) {
        const el = wordRefs.current[i];
        if (el && el.offsetTop > firstLineY + 15) {
          newFirstIndex = i;
          break;
        }
      }
      if (newFirstIndex > firstVisibleWordIndex) {
        setFirstVisibleWordIndex(newFirstIndex);
      }
    }
  }, [activeWordIndex, firstVisibleWordIndex, userInput]);

  const visibleWordsCount = 50;
  const visibleWords = wordsData.slice(firstVisibleWordIndex, firstVisibleWordIndex + visibleWordsCount);

  return (
    <div className="relative w-full max-w-5xl flex flex-col items-center outline-none">
      {mode === 'time' && (
        <div className="w-full text-center md:text-left text-2xl text-[var(--color-primary)] mb-4">
          {timeLeft}
        </div>
      )}

      <div className="relative w-full overflow-hidden h-[170px]">
        <div 
          className="flex flex-wrap justify-start text-[2.15rem] leading-relaxed font-medium text-center cursor-default content-start"
          style={{ color: 'var(--color-text)' }}
        >
          {visibleWords.map((wordObj) => {
            return (
              <div 
                key={wordObj.id}
                // @ts-ignore
                ref={(el) => (wordRefs.current[wordObj.id] = el)}
                className="mx-[0.3em] mb-2 flex relative"
              >
                {wordObj.word.split('').map((char, i) => {
                  const globalIndex = wordObj.startIndex + i;
                  const isCurrentChar = globalIndex === userInput.length;
                  
                  let stateClass = '';
                  if (globalIndex < userInput.length) {
                    stateClass = userInput[globalIndex] === char 
                      ? 'text-[var(--color-primary)]' 
                      : 'text-[var(--color-error)] bg-[var(--color-error)]/20 rounded-sm';
                  }

                  return (
                    <span key={i} className={`relative transition-colors duration-75 ${stateClass}`}>
                      {isCurrentChar && (
                        <span className="absolute -left-[1px] top-1 bottom-1 w-[2px] bg-[var(--color-primary)] animate-pulse" />
                      )}
                      {char}
                    </span>
                  );
                })}

                <span className="relative inline-block w-[0.2em]"> 
                  {userInput.length === wordObj.endIndex && (
                    <span className="absolute -left-[1px] top-1 bottom-1 w-[2px] bg-[var(--color-primary)] animate-pulse" />
                  )}
                  {userInput.length > wordObj.endIndex && userInput[wordObj.endIndex] !== ' ' && (
                    <span className="absolute text-[var(--color-error)] bg-[var(--color-error)]/20 rounded-sm -left-[1px] top-0 bottom-0 w-full opacity-50" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TypingArea;