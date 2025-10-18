import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import './PlayerTicket.css';

const PlayerTicket = ({ ticket, calledNumbers }) => {
  const [markedNumbers, setMarkedNumbers] = useState(new Set());
  const { markNumber } = useGame();

  // Debug logging
  console.log('PlayerTicket render:', { ticket, calledNumbers });

  // Handle loading state when ticket is not yet available
  if (!ticket || !Array.isArray(ticket)) {
    console.log('PlayerTicket: No ticket data available');
    return (
      <div className="player-ticket">
        <div className="ticket-header">
          <h2>Your Ticket</h2>
        </div>
        <div className="loading-ticket">
          <div className="spinner"></div>
          <p>Loading your ticket...</p>
          <p style={{fontSize: '12px', marginTop: '10px', opacity: 0.7}}>
            Debug: ticket = {JSON.stringify(ticket)}
          </p>
        </div>
      </div>
    );
  }

  const handleNumberClick = (number) => {
    if (number === 0) return; // Don't mark empty cells
    
    const newMarkedNumbers = new Set(markedNumbers);
    if (newMarkedNumbers.has(number)) {
      newMarkedNumbers.delete(number);
    } else {
      newMarkedNumbers.add(number);
      markNumber(number);
    }
    setMarkedNumbers(newMarkedNumbers);
  };

  const isNumberCalled = (number) => calledNumbers && calledNumbers.includes(number);
  const isNumberMarked = (number) => markedNumbers.has(number);

  return (
    <div className="player-ticket">
      <div className="ticket-header">
        <h2>🎟️ Your Lucky Ticket 🎟️</h2>
        <div className="ticket-legend">
          <div className="legend-item">
            <div className="legend-color called"></div>
            <span>✅ Called & Marked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)', border: '1px solid #d97706'}}></div>
            <span>📢 Just Called</span>
          </div>
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>⭐ Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color missed"></div>
            <span>⚠️ Missed</span>
          </div>
        </div>
      </div>

      <div className="ticket-grid">
        {ticket.map((row, rowIndex) => (
          <div key={rowIndex} className="ticket-row">
            {row.map((number, colIndex) => {
              const isEmpty = number === 0;
              const isCalled = isNumberCalled(number);
              const isMarked = isNumberMarked(number);
              const isMissed = isCalled && !isMarked && !isEmpty;
              const isCalledOnly = isCalled && !isMarked && !isMissed && !isEmpty;
              
              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`ticket-cell ${isEmpty ? 'empty' : ''} ${
                    isMarked && !isCalled ? 'marked' : ''
                  } ${isMissed ? 'missed' : ''} ${isCalled && isMarked ? 'called-marked' : ''} ${
                    isCalledOnly ? 'called' : ''
                  }`}
                  onClick={() => !isEmpty && handleNumberClick(number)}
                  whileHover={!isEmpty ? { scale: 1.05 } : {}}
                  whileTap={!isEmpty ? { scale: 0.95 } : {}}
                  animate={{
                    backgroundColor: 
                      isEmpty ? 'transparent' :
                      isCalled && isMarked ? '#4caf50' :
                      isMissed ? '#f44336' :
                      isMarked ? '#2196f3' :
                      '#ffffff'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {!isEmpty && (
                    <>
                      <span className="number">{number}</span>
                      {isCalled && isMarked && (
                        <motion.div
                          className="check-mark"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          ✓
                        </motion.div>
                      )}
                      {isMissed && (
                        <motion.div
                          className="warning-mark"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          !
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="ticket-stats">
        <div className="stat">
          <span className="stat-label">🎯 Marked:</span>
          <span className="stat-value">{markedNumbers.size}</span>
        </div>
        <div className="stat">
          <span className="stat-label">📝 Total:</span>
          <span className="stat-value">{ticket.flat().filter(n => n !== 0).length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">🏁 Progress:</span>
          <span className="stat-value">
            {Math.round((markedNumbers.size / ticket.flat().filter(n => n !== 0).length) * 100)}%
          </span>
        </div>
      </div>

      <div className="ticket-instructions">
        <p>🎯 <strong>Tap numbers when called</strong> to mark your ticket!</p>
        <p>� <strong>Watch for yellow highlights</strong> - those numbers were just called!</p>
        <p>🏆 <strong>Mark all your numbers</strong> to win amazing prizes!</p>
      </div>
    </div>
  );
};

export default PlayerTicket;