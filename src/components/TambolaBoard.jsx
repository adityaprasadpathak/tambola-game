import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TambolaBoard.css';

const TambolaBoard = ({ currentNumber, calledNumbers }) => {
  const [displayedCalledNumbers, setDisplayedCalledNumbers] = useState(calledNumbers || []);
  
  // Generate all numbers 1-90
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

  // Sync displayed numbers with a delay so the 3D ball animation can finish
  // before the grid highlights the number green
  useEffect(() => {
    if (!calledNumbers) return;
    
    // Immediate sync for initial load, refresh, or game reset
    // Also sync immediately if only 1 number called (first roll) or if we somehow skipped length
    if (calledNumbers.length <= 1 || displayedCalledNumbers.length === 0 || calledNumbers.length < displayedCalledNumbers.length) {
      setDisplayedCalledNumbers(calledNumbers);
      return;
    }

    // Delay the update to match ball animation (1.2s)
    const timer = setTimeout(() => {
      setDisplayedCalledNumbers(calledNumbers);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [calledNumbers]);

  return (
    <div className="tambola-board">
      <div className="board-header">
        <h2>Numbers Called</h2>
        <div className="current-number-display">
          <AnimatePresence mode="wait">
            {(currentNumber || calledNumbers?.length > 0) && (
              <motion.div
                key={`ball-${currentNumber || calledNumbers?.[calledNumbers.length - 1]}-${calledNumbers?.length || 0}`}
                className="pool-ball-number"
                initial={{ 
                  x: -400,
                  y: 0,
                  rotate: 0,
                  scale: 0.8,
                  opacity: 0
                }}
                animate={{ 
                  x: 0,
                  y: [0, -15, -8, -3, 0],
                  rotate: 360,
                  scale: [0.8, 1.1, 1],
                  opacity: 1
                }}
                exit={{ 
                  x: 400,
                  opacity: 0,
                  scale: 0.8
                }}
                transition={{ 
                  duration: 1.2,
                  ease: "easeOut"
                }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
                data-number={currentNumber || calledNumbers?.[calledNumbers.length - 1]}
              >
                <span className="ball-number">{currentNumber || calledNumbers?.[calledNumbers.length - 1] || '?'}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!currentNumber && (
            <div className="current-number waiting">
              ?
            </div>
          )}
        </div>
      </div>

      <div className="numbers-grid">
        {allNumbers.map((number) => {
          const isCalled = displayedCalledNumbers.includes(number);
          const isCurrentNumber = isCalled && currentNumber === number;
          
          return (
            <motion.div
              key={number}
              className={`number-cell ${isCalled ? 'called' : ''} ${isCurrentNumber ? 'current' : ''}`}
              initial={false}
              animate={{
                scale: isCurrentNumber ? 1.2 : 1,
                backgroundColor: isCalled ? '#4caf50' : isCurrentNumber ? '#ff9800' : '#f5f5f5'
              }}
              transition={{ duration: 0.3 }}
            >
              {number}
            </motion.div>
          );
        })}
      </div>

      <div className="board-stats">
        <div className="stat">
          <span className="stat-label">Called:</span>
          <span className="stat-value">{displayedCalledNumbers.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining:</span>
          <span className="stat-value">{90 - displayedCalledNumbers.length}</span>
        </div>
      </div>

      {displayedCalledNumbers.length > 0 && (
        <div className="recent-numbers">
          <h3>Recent Numbers</h3>
          <div className="recent-list">
            <AnimatePresence>
              {displayedCalledNumbers.slice(-10).reverse().map((number, index) => (
                <motion.span
                  layout
                  key={`recent-${number}`}
                  className="recent-number"
                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25, delay: index * 0.05 }}
                >
                  {number}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default TambolaBoard;