import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import './PlayerTicket.css';

const PlayerTicket = ({ ticket, calledNumbers }) => {
  const [markedNumbers, setMarkedNumbers] = useState(new Set());
  const { markNumber } = useGame();

  if (!ticket || !Array.isArray(ticket)) {
    return (
      <div className="player-ticket">
        <div className="ticket-header">
          <h2>Your Ticket</h2>
        </div>
        <div className="loading-ticket">
          <div className="spinner" />
          <p>Loading your ticket…</p>
        </div>
      </div>
    );
  }

  const handleNumberClick = number => {
    if (number === 0) return;
    const updated = new Set(markedNumbers);
    if (updated.has(number)) {
      updated.delete(number);
    } else {
      updated.add(number);
      markNumber(number);
    }
    setMarkedNumbers(updated);
  };

  const isCalled  = num => calledNumbers?.includes(num) ?? false;
  const isMarked  = num => markedNumbers.has(num);

  // Ticket stats
  const allNums   = ticket.flat().filter(n => n !== 0);
  const markedCnt = markedNumbers.size;
  const progress  = allNums.length > 0 ? Math.round((markedCnt / allNums.length) * 100) : 0;

  return (
    <div className="player-ticket">
      <div className="ticket-header">
        <h2>🎟️ Your Ticket</h2>
        <div className="ticket-legend">
          <div className="legend-item">
            <div className="legend-color called-marked" />
            <span>Marked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color missed" />
            <span>Missed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color available" />
            <span>Available</span>
          </div>
        </div>
      </div>

      <div className="ticket-grid">
        {ticket.map((row, rowIndex) => (
          <div key={rowIndex} className="ticket-row">
            {row.map((number, colIndex) => {
              const empty      = number === 0;
              const called     = !empty && isCalled(number);
              const marked     = !empty && isMarked(number);
              const calledMark = called && marked;
              const missed     = called && !marked;

              const cellClass = [
                'ticket-cell',
                empty      ? 'empty'        : '',
                calledMark ? 'called-marked' : '',
                missed     ? 'missed'        : '',
                marked && !called ? 'marked' : '',
                !empty && !called && !marked ? 'available' : ''
              ].filter(Boolean).join(' ');

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={cellClass}
                  onClick={() => !empty && handleNumberClick(number)}
                  whileHover={!empty ? { scale: 1.04, y: -2 } : {}}
                  whileTap={!empty ? { scale: 0.96 } : {}}
                  animate={{
                    backgroundColor:
                      empty      ? 'transparent' :
                      calledMark ? '#22c55e'      :
                      missed     ? '#ef4444'      :
                      marked     ? '#3b82f6'      :
                                   '#ffffff1a'
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {!empty && (
                    <>
                      <span className="number">{number}</span>
                      {calledMark && (
                        <motion.div
                          className="check-mark"
                          initial={{ scale: 0, rotate: -15 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                        >
                          ✓
                        </motion.div>
                      )}
                      {missed && (
                        <motion.div
                          className="warning-mark"
                          initial={{ scale: 0, rotate: 15 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
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
          <span className="stat-label">Marked</span>
          <span className="stat-value">{markedCnt}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total</span>
          <span className="stat-value">{allNums.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Progress</span>
          <span className="stat-value">{progress}%</span>
        </div>
      </div>

      <div className="ticket-instructions">
        <p>🎯 <strong>Tap numbers when called</strong> to mark your ticket!</p>
      </div>
    </div>
  );
};

export default PlayerTicket;