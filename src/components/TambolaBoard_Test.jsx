import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './TambolaBoard.css';

const TambolaBoard = ({ currentNumber, calledNumbers }) => {
  const [testNumber, setTestNumber] = useState(42);
  
  // Enhanced debug logging
  console.log('TambolaBoard Debug:', {
    currentNumber,
    currentNumberType: typeof currentNumber,
    calledNumbers,
    calledNumbersLength: calledNumbers?.length,
    shouldShowAnimation: !!currentNumber,
    testNumber
  });
  
  // Test button to manually trigger animation
  const triggerTestAnimation = () => {
    setTestNumber(prev => prev + 1);
  };

  // Generate all numbers 1-90
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <div className="tambola-board">
      <div className="board-header">
        <h2>Numbers Called</h2>
        {/* Debug test button */}
        <button 
          onClick={triggerTestAnimation}
          style={{
            padding: '4px 8px',
            margin: '0 10px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          Test Animation ({testNumber})
        </button>
        <button 
          onClick={() => console.log('Debug - currentNumber:', currentNumber, 'testNumber:', testNumber)}
          style={{
            padding: '4px 8px',
            margin: '0 10px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          Debug Current: {currentNumber || 'null'}
        </button>
        <div className="current-number-display">
          {/* Always show test animation */}
          <motion.div
            key={`test-${testNumber}`}
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
              opacity: [0, 1, 1]
            }}
            transition={{ 
              duration: 1.2,
              ease: "easeOut",
              rotate: { ease: "linear" }
            }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
          >
            <span className="ball-number">{currentNumber || testNumber}</span>
          </motion.div>
          
          {!currentNumber && (
            <div className="current-number waiting">
              ?
            </div>
          )}
        </div>
      </div>

      <div className="numbers-grid">
        {allNumbers.map((number) => {
          const isCalled = calledNumbers.includes(number);
          const isCurrentNumber = currentNumber === number;
          
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
          <span className="stat-value">{calledNumbers.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining:</span>
          <span className="stat-value">{90 - calledNumbers.length}</span>
        </div>
      </div>

      {calledNumbers.length > 0 && (
        <div className="recent-numbers">
          <h3>Recent Numbers</h3>
          <div className="recent-list">
            {calledNumbers.slice(-10).reverse().map((number, index) => (
              <motion.span
                key={`${number}-${index}`}
                className="recent-number"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {number}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TambolaBoard;