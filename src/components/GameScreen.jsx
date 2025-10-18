import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import TambolaBoard from './TambolaBoard';
import PlayersList from './PlayersList';
import PlayerTicket from './PlayerTicket';
import ClaimsPanel from './ClaimsPanel';
import NotificationSystem from './NotificationSystem';
import './GameScreen.css';

const GameScreen = () => {
  const navigate = useNavigate();
  const { 
    gameState, 
    playerTicket, 
    player, 
    isConnected,
    currentNumber,
    calledNumbers,
    winners,
    startGame
  } = useGame();

  // Debug logging
  console.log('GameScreen Debug:', {
    playerTicket,
    gameState: gameState?.status,
    player: player?.name,
    isConnected
  });

  useEffect(() => {
    // Redirect to landing page if no player data
    if (!player && isConnected) {
      navigate('/');
    }
  }, [player, isConnected, navigate]);

  if (!player || !isConnected) {
    return (
      <div className="game-screen loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Connecting to game...</p>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="game-screen waiting">
        <div className="waiting-content">
          <motion.div
            className="waiting-animation"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🎲
          </motion.div>
          <h2>Waiting for game to start...</h2>
          <p>Looking for other players to join</p>
          <div className="waiting-dots">
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            >
              •
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            >
              •
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            >
              •
            </motion.span>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic scaling to guarantee everything fits in viewport without scroll
  const layoutRef = useRef(null);
  const [scale, setScale] = useState(1);

  const recomputeScale = useCallback(() => {
    if (!layoutRef.current) return;
    const header = document.querySelector('.game-header');
    const headerHeight = header ? header.offsetHeight + 16 : 0; // spacing
    const available = window.innerHeight - headerHeight - 8; // small padding
    const needed = layoutRef.current.scrollHeight;
    if (needed > 0) {
      const next = Math.min(1, available / needed);
      // add slight buffer so we don't overflow by 1px causing scrollbars
      setScale(next < 0.995 ? next - 0.01 : 1);
    }
  }, []);

  useEffect(() => {
    recomputeScale();
    window.addEventListener('resize', recomputeScale);
    const id = setInterval(recomputeScale, 1500); // periodic reflow guard as content changes
    return () => { window.removeEventListener('resize', recomputeScale); clearInterval(id); };
  }, [recomputeScale, gameState, playerTicket, winners]);

  return (
    <div className="game-screen">
      <NotificationSystem />
      
      <div className="game-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-title"
        >
          TAMBOLA GAME
        </motion.h1>
        <div className="game-status">
          <span className={`status-badge ${gameState.status}`}>
            {gameState.status === 'waiting' ? 'Waiting for Players' : 
             gameState.status === 'active' ? 'Game Active' : 'Game Complete'}
          </span>
          {/* Manual Start for Testing */}
          {gameState.status === 'waiting' && player?.isHost && (
            <button 
              onClick={startGame}
              className="start-game-btn"
              style={{
                marginLeft: '10px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🎱 Start Game (Test)
            </button>
          )}
        </div>
      </div>

      <div 
        className={`game-layout-scale ${scale < 1 ? 'scaled' : ''}`}
        style={{ '--ui-scale': scale }}
      >
      <div className="game-layout" ref={layoutRef}>
        {/* Left Panel - Tambola Board & Current Number */}
        <div className="left-panel">
          <TambolaBoard 
            currentNumber={currentNumber}
            calledNumbers={calledNumbers}
          />
        </div>

        {/* Center Panel - Player Ticket */}
        <div className="center-panel">
          <PlayerTicket 
            ticket={playerTicket?.ticket}
            calledNumbers={calledNumbers}
          />
        </div>

        {/* Right Panel - Players */}
        <div className="right-panel">
          <PlayersList 
            players={gameState.players}
            currentPlayer={player}
            winners={winners}
          />
        </div>

        {/* Claims Panel Section */}
        <div className="claims-panel-section">
          <ClaimsPanel 
            winners={winners}
            gameStatus={gameState.status}
          />
        </div>
      </div>
      </div>

      {gameState.status === 'completed' && (
        <motion.div
          className="game-complete-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="game-complete-content">
            <h2>🎉 Game Complete! 🎉</h2>
            
            {/* Overall Winner */}
            {gameState?.players && (() => {
              const sortedPlayers = [...gameState.players].sort((a, b) => (b.score || 0) - (a.score || 0));
              const topPlayer = sortedPlayers[0];
              return topPlayer && (
                <div className="overall-winner">
                  <h3>🏆 "{topPlayer.name}" Wins! 🏆</h3>
                  <div className="winner-score">Total Score: {topPlayer.score || 0} points</div>
                </div>
              );
            })()}
            
            {/* Final Scores */}
            {gameState?.players && (
              <div className="final-scores">
                <h4>Final Scores</h4>
                <div className="scores-list">
                  {[...gameState.players]
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .map((player, index) => (
                      <div key={player.id} className={`score-item ${index === 0 ? 'first-place' : ''}`}>
                        <span className="rank">#{index + 1}</span>
                        <span className="player-name">{player.avatar} {player.name}</span>
                        <span className="score">{player.score || 0} pts</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Pattern Winners */}
            <div className="pattern-winners">
              <h4>Pattern Winners</h4>
              <div className="final-winners">
                {Object.entries(winners).map(([pattern, winner]) => (
                  winner && (
                    <div key={pattern} className="winner-item">
                      <span className="pattern">{pattern.replace(/_/g, ' ')}</span>
                      <span className="winner">
                        {Array.isArray(winner) ? (
                          winner.map(w => `${w.playerName} ${w.avatar}`).join(', ')
                        ) : (
                          `${winner.playerName} ${winner.avatar}`
                        )}
                        {winner.score && ` (${winner.score} pts)`}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/')}
              className="back-to-lobby-btn"
            >
              Back to Lobby
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GameScreen;