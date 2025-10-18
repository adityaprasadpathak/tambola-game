import React from 'react';
import { motion } from 'framer-motion';
import './PlayersList.css';

const PlayersList = ({ players, currentPlayer, winners }) => {
  // Calculate scores for each player
  const playersWithScores = players?.map(player => {
    let totalScore = 0;
    Object.values(winners || {}).forEach(winner => {
      if (Array.isArray(winner)) {
        winner.forEach(w => {
          if (w.playerId === player.id) {
            totalScore += w.score || 0;
          }
        });
      } else if (winner?.playerId === player.id) {
        totalScore += winner.score || 0;
      }
    });
    
    return {
      ...player,
      totalScore
    };
  }) || [];
  return (
    <div className="players-list">
      <h3>Players ({players.length}/6)</h3>
      <div className="players-container">
        {playersWithScores.map((player, index) => (
          <motion.div
            key={player.id}
            className={`player-card ${player.id === currentPlayer.id ? 'current-player' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="player-avatar">
              {player.avatar}
            </div>
            <div className="player-info">
              <div className="player-name">
                {player.name?.length > 10 ? player.name.substring(0, 10) + '...' : player.name} [{player.totalScore}]
                {player.id === currentPlayer?.id && (
                  <span className="you-label">(You)</span>
                )}
              </div>
              <div className="player-status">
                <div className="status-indicator online"></div>
                <span>Online</span>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Show empty slots */}
        {Array.from({ length: 6 - playersWithScores.length }).map((_, index) => (
          <div key={`empty-${index}`} className="player-card empty">
            <div className="player-avatar empty">
              ?
            </div>
            <div className="player-info">
              <div className="player-name">Waiting for player...</div>
              <div className="player-status">
                <div className="status-indicator waiting"></div>
                <span>Waiting</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersList;