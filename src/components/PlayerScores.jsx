import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Trophy } from 'lucide-react';
import './PlayerScores.css';

const PlayerScores = ({ players, currentPlayer, winners }) => {
  // Get all players with their scores
  const playersWithScores = players?.map(player => {
    // Calculate total score from winners
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
  }).sort((a, b) => b.totalScore - a.totalScore) || [];

  // Get player ranking
  const getPlayerRank = (playerScore, index) => {
    if (index === 0 && playerScore > 0) return 'first';
    if (index === 1 && playerScore > 0) return 'second';
    if (index === 2 && playerScore > 0) return 'third';
    return 'regular';
  };

  // Get rank icon
  const getRankIcon = (rank) => {
    switch (rank) {
      case 'first': return <Crown size={14} />;
      case 'second': return <Trophy size={14} />;
      case 'third': return <Star size={14} />;
      default: return null;
    }
  };

  return (
    <div className="player-scores-panel">
      <div className="panel-header">
        <h3>Players</h3>
        <div className="player-count">{playersWithScores.length} Online</div>
      </div>
      
      <div className="players-container">
        {playersWithScores.map((player, index) => {
          const isActive = currentPlayer?.id === player.id;
          const rank = getPlayerRank(player.totalScore, index);
          const displayName = player.name?.length > 10 
            ? player.name.substring(0, 10) + '...' 
            : player.name;
          const isOnline = player.isConnected !== false; // Assume online unless explicitly false
          
          return (
            <motion.div
              key={player.id}
              className={`player-card ${rank} ${isActive ? 'active' : ''} ${isOnline ? 'online' : 'offline'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="player-info">
                <div className="player-status">
                  <div className={`online-indicator ${isOnline ? 'online' : 'offline'}`}></div>
                </div>
                
                <div className="player-name-section">
                  {rank !== 'regular' && (
                    <div className="rank-icon">
                      {getRankIcon(rank)}
                    </div>
                  )}
                  <div className="player-name">
                    {displayName} [{player.totalScore}]
                  </div>
                </div>
              </div>
              
              {isActive && (
                <motion.div
                  className="active-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {playersWithScores.length === 0 && (
        <div className="no-players">
          <div className="empty-state">
            <Star size={24} />
            <p>Waiting for players to join...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerScores;