import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import TambolaBoard from './TambolaBoard';
import PlayersList from './PlayersList';
import PlayerTicket from './PlayerTicket';
import ClaimsPanel from './ClaimsPanel';
import PlayerScores from './PlayerScores';
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

  // ── All hooks declared at the top (Rules of Hooks) ──────────────────────
  const layoutRef   = useRef(null);
  const roRef       = useRef(null);
  const [scale, setScale] = useState(1);

  const recomputeScale = useCallback(() => {
    if (!layoutRef.current) return;
    const header        = document.querySelector('.game-header');
    const headerHeight  = header ? header.offsetHeight + 16 : 0;
    const available     = window.innerHeight - headerHeight - 16;
    const needed        = layoutRef.current.scrollHeight;
    if (needed > 0) {
      const next = Math.min(1, available / needed);
      setScale(next < 0.995 ? next - 0.01 : 1);
    }
  }, []);

  // ResizeObserver for layout scale (replaces setInterval polling)
  useEffect(() => {
    if (!layoutRef.current) return;
    roRef.current = new ResizeObserver(recomputeScale);
    roRef.current.observe(layoutRef.current);
    window.addEventListener('resize', recomputeScale);
    recomputeScale();
    return () => {
      if (roRef.current) roRef.current.disconnect();
      window.removeEventListener('resize', recomputeScale);
    };
  }, [recomputeScale, gameState, playerTicket, winners]);

  // Redirect guard
  useEffect(() => {
    if (!player && isConnected) {
      navigate('/');
    }
  }, [player, isConnected, navigate]);

  // ── Loading / Waiting states ─────────────────────────────────────────────
  if (!player || !isConnected) {
    return (
      <div className="game-screen loading">
        <div className="loading-content">
          <div className="spinner" />
          <p>Connecting to game…</p>
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
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🎲
          </motion.div>
          <h2>Waiting for game to start…</h2>
          <p>Looking for other players to join</p>
          <div className="waiting-dots">
            {[0, 0.3, 0.6].map((delay, i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay }}
              >
                •
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Main Game UI ─────────────────────────────────────────────────────────
  return (
    <div className="game-screen">
      <NotificationSystem />

      {/* Header */}
      <div className="game-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-title"
        >
          TAMBOLA
        </motion.h1>
        <div className="game-status">
          <span className={`status-badge ${gameState.status}`}>
            {gameState.status === 'waiting'   ? 'Waiting for Players' :
             gameState.status === 'active'    ? '🎱 Game Live'        : '🏆 Game Over'}
          </span>
          {gameState.status === 'waiting' && player?.isHost && (
            <button onClick={startGame} className="start-game-btn">
              🎱 Start Game
            </button>
          )}
        </div>
      </div>

      {/* Scaled layout wrapper */}
      <div
        className={`game-layout-scale${scale < 1 ? ' scaled' : ''}`}
        style={{ '--ui-scale': scale }}
      >
        <div className="game-layout" ref={layoutRef}>
          {/* Left — Number Board */}
          <div className="left-panel">
            <TambolaBoard
              currentNumber={currentNumber}
              calledNumbers={calledNumbers}
            />
          </div>

          {/* Centre — Player Ticket */}
          <div className="center-panel">
            <PlayerTicket
              ticket={playerTicket?.ticket}
              calledNumbers={calledNumbers}
            />
          </div>

          {/* Right — Leaderboard */}
          <div className="right-panel">
            <PlayerScores
              players={gameState.players}
              currentPlayer={player}
              winners={winners}
            />
          </div>

          {/* Far-right — Claims */}
          <div className="claims-panel-section">
            <ClaimsPanel
              winners={winners}
              gameStatus={gameState.status}
            />
          </div>
        </div>
      </div>

      {/* Game-Complete Overlay */}
      {gameState.status === 'completed' && (
        <motion.div
          className="game-complete-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="game-complete-content"
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="gc-fireworks">🎉</div>
            <h2 className="gc-title">Game Complete!</h2>

            {/* Top player */}
            {gameState?.players && (() => {
              const sorted   = [...gameState.players].sort((a, b) => (b.score || 0) - (a.score || 0));
              const topPlayer = sorted[0];
              return topPlayer && (
                <div className="gc-champion">
                  <div className="gc-champion-avatar">{topPlayer.avatar}</div>
                  <div className="gc-champion-name">{topPlayer.name}</div>
                  <div className="gc-champion-label">🏆 Grand Champion</div>
                  <div className="gc-champion-score">{topPlayer.score || 0} pts</div>
                </div>
              );
            })()}

            {/* Final leaderboard */}
            {gameState?.players && (
              <div className="gc-scores">
                <h4>Final Leaderboard</h4>
                <div className="gc-scores-list">
                  {[...gameState.players]
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .map((p, idx) => (
                      <div key={p.id} className={`gc-score-row${idx === 0 ? ' gold' : ''}`}>
                        <span className="gc-rank">#{idx + 1}</span>
                        <span className="gc-avatar">{p.avatar}</span>
                        <span className="gc-name">{p.name}</span>
                        <span className="gc-pts">{p.score || 0} pts</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Pattern winners */}
            <div className="gc-patterns">
              <h4>Pattern Winners</h4>
              <div className="gc-pattern-list">
                {Object.entries(winners).map(([pattern, winner]) =>
                  winner && (
                    <div key={pattern} className="gc-pattern-row">
                      <span className="gc-pattern-name">
                        {pattern.replace(/_/g, ' ')}
                      </span>
                      <span className="gc-pattern-winner">
                        {Array.isArray(winner)
                          ? winner.map(w => `${w.avatar} ${w.playerName}`).join(', ')
                          : `${winner.avatar} ${winner.playerName}`}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <button className="gc-lobby-btn" onClick={() => navigate('/')}>
              🏠 Back to Lobby
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GameScreen;