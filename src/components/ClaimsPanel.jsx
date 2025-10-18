import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Target, Grid3X3, Home, Zap, ArrowUp, Minus, ArrowDown, Maximize, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import './ClaimsPanel.css';

// Ultra-premium animated custom icons with world-class design
const FirstFiveIcon = () => (
  <motion.div 
    className="claim-icon-container"
    whileHover={{ scale: 1.2 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <motion.div
      animate={{ 
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Zap size={16} style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />
    </motion.div>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ delay: 0.5, duration: 0.6, ease: "backOut" }}
      style={{ 
        position: 'absolute', 
        top: '-6px', 
        right: '-10px', 
        fontSize: '9px', 
        fontWeight: '900',
        background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
        borderRadius: '50%',
        width: '14px',
        height: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.5)'
      }}
    >
      5
    </motion.div>
  </motion.div>
);

const TopLineIcon = () => (
  <motion.div 
    className="claim-icon-container"
    whileHover={{ scale: 1.2, y: -2 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
  >
    <motion.div
      animate={{ 
        scaleX: [1, 1.3, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ 
        width: '16px', 
        height: '3px', 
        background: 'linear-gradient(90deg, transparent, currentColor, transparent)', 
        borderRadius: '2px',
        boxShadow: '0 0 6px currentColor'
      }}
    />
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    >
      <ArrowUp size={12} style={{ filter: 'drop-shadow(0 0 3px currentColor)' }} />
    </motion.div>
  </motion.div>
);

const MiddleLineIcon = () => (
  <motion.div 
    className="claim-icon-container"
    whileHover={{ scale: 1.2 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <motion.div
      animate={{ 
        scaleX: [1, 1.4, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ 
        width: '18px', 
        height: '3px', 
        background: 'linear-gradient(90deg, transparent, currentColor, currentColor, transparent)', 
        borderRadius: '2px',
        boxShadow: '0 0 8px currentColor',
        position: 'relative'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '4px',
        height: '4px',
        background: 'currentColor',
        borderRadius: '50%',
        boxShadow: '0 0 4px currentColor'
      }} />
    </motion.div>
  </motion.div>
);

const BottomLineIcon = () => (
  <motion.div 
    className="claim-icon-container"
    whileHover={{ scale: 1.2, y: 2 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
  >
    <motion.div
      animate={{ y: [0, 2, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    >
      <ArrowDown size={12} style={{ filter: 'drop-shadow(0 0 3px currentColor)' }} />
    </motion.div>
    <motion.div
      animate={{ 
        scaleX: [1, 1.3, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ 
        width: '16px', 
        height: '3px', 
        background: 'linear-gradient(90deg, transparent, currentColor, transparent)', 
        borderRadius: '2px',
        boxShadow: '0 0 6px currentColor'
      }}
    />
  </motion.div>
);

const FourCornersIcon = () => (
  <motion.div 
    className="claim-icon-container"
    whileHover={{ scale: 1.2, rotate: 5 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    style={{ position: 'relative', width: '18px', height: '18px' }}
  >
    {[
      { top: '1px', left: '1px', delay: 0 },
      { top: '1px', right: '1px', delay: 0.1 },
      { bottom: '1px', left: '1px', delay: 0.2 },
      { bottom: '1px', right: '1px', delay: 0.3 }
    ].map((pos, index) => (
      <motion.div
        key={index}
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 1.2,
          delay: pos.delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ 
          position: 'absolute', 
          ...pos,
          width: '4px', 
          height: '4px', 
          background: 'radial-gradient(circle, currentColor, transparent)',
          borderRadius: '50%',
          boxShadow: '0 0 6px currentColor'
        }}
      />
    ))}
    <motion.div
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '8px', 
        height: '8px', 
        border: '1.5px solid currentColor', 
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.1)',
        boxShadow: 'inset 0 0 4px currentColor'
      }}
    />
  </motion.div>
);

const FullHouseIcon = () => (
  <motion.div 
    className="claim-icon-container"
    whileHover={{ scale: 1.3, rotate: [-2, 2, -2, 0] }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Award size={16} style={{ 
        filter: 'drop-shadow(0 0 6px currentColor)',
        color: 'inherit'
      }} />
    </motion.div>
    <motion.div
      animate={{ 
        y: [0, -1, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ 
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.3
      }}
      style={{ 
        position: 'absolute', 
        top: '-6px', 
        right: '-4px',
        filter: 'drop-shadow(0 0 4px #ffd700)'
      }}
    >
      <Crown size={10} style={{ color: '#ffd700' }} />
    </motion.div>
    <motion.div
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0.5, 1.5, 0.5]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ 
        position: 'absolute',
        width: '24px',
        height: '24px',
        border: '1px solid currentColor',
        borderRadius: '50%',
        opacity: 0.3
      }}
    />
  </motion.div>
);

const claimTypes = [
  {
    id: 'FIRST_FIVE',
    name: 'First Five',
    description: '⚡ First 5 numbers called',
    icon: FirstFiveIcon,
    color: '#ff9800',
    gradient: 'linear-gradient(135deg, #ff9800, #f57c00)',
    priority: 'high',
    prize: '🎁 Quick Win Bonus',
    rarity: 'common'
  },
  {
    id: 'TOP_LINE',
    name: 'Top Line',
    description: '📏 Complete top row',
    icon: TopLineIcon,
    color: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3, #1976d2)',
    priority: 'medium',
    prize: '🏆 Line Champion',
    rarity: 'common'
  },
  {
    id: 'MIDDLE_LINE',
    name: 'Middle Line',
    description: '🎯 Complete middle row',
    icon: MiddleLineIcon,
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50, #388e3c)',
    priority: 'medium',
    prize: '🏆 Line Master',
    rarity: 'common'
  },
  {
    id: 'BOTTOM_LINE',
    name: 'Bottom Line',
    description: '📐 Complete bottom row',
    icon: BottomLineIcon,
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
    priority: 'medium',
    prize: '🏆 Line Expert',
    rarity: 'common'
  },
  {
    id: 'FOUR_CORNERS',
    name: 'Four Corners',
    description: '💎 All corner numbers',
    icon: FourCornersIcon,
    color: '#e91e63',
    gradient: 'linear-gradient(135deg, #e91e63, #c2185b)',
    priority: 'high',
    prize: '💎 Corner King',
    rarity: 'rare'
  },
  {
    id: 'FULL_HOUSE',
    name: 'Full House',
    description: '👑 Complete entire ticket',
    icon: FullHouseIcon,
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700, #ffc107)',
    priority: 'ultimate',
    prize: '👑 Grand Champion',
    rarity: 'legendary'
  }
];

const ClaimsPanel = ({ winners, gameStatus }) => {
  const { claimPattern } = useGame();

  const handleClaim = (claimType) => {
    console.log('🎯 CLAIM BUTTON CLICKED:', {
      claimType,
      gameStatus,
      winners,
      hasWinner: !!winners[claimType],
      isActive: gameStatus === 'active',
      timestamp: new Date().toLocaleTimeString()
    });
    
    if (gameStatus === 'active' && !winners[claimType]) {
      console.log('✅ Calling claimPattern with:', claimType);
      claimPattern(claimType);
    } else {
      console.log('❌ Claim blocked:', {
        reason: gameStatus !== 'active' ? 'Game not active' : 'Already won',
        gameStatus,
        alreadyWon: !!winners[claimType]
      });
    }
  };

  return (
    <div className="claims-panel">
      <h3>Claims & Prizes</h3>
      <div className="claims-container">
        {claimTypes.map((claim, index) => {
          const winner = winners[claim.id];
          const isWon = !!winner;
          const Icon = claim.icon;
          
          return (
            <motion.div
              key={claim.id}
              className={`claim-card ${isWon ? 'won' : 'available'}`}
              data-claim-type={claim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isWon && gameStatus === 'active' ? { scale: 1.02 } : {}}
            >
              <div className="claim-header">
                <div 
                  className="claim-icon"
                  style={{ backgroundColor: claim.iconBg }}
                >
                  <Icon size={16} />
                </div>
                <div className="claim-info">
                  <div className="claim-name">{claim.name}</div>
                  <div className="claim-description">{claim.description}</div>
                </div>
                {isWon && (
                  <div className="winner-indicator">
                    <Trophy size={16} color="#ffd700" />
                  </div>
                )}
              </div>
              
              {isWon ? (
                <div className="winners-info">
                  {Array.isArray(winner) ? (
                    winner.map((w, idx) => (
                      <div key={w.playerId} className="winner-info">
                        <div className="winner-avatar">{w.avatar}</div>
                        <div className="winner-details">
                          <div className="winner-name">{w.playerName}</div>
                          {w.score && <div className="winner-score">{w.score} pts</div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="winner-info">
                      <div className="winner-avatar">{winner.avatar}</div>
                      <div className="winner-details">
                        <div className="winner-name">{winner.playerName}</div>
                        {winner.score && <div className="winner-score">{winner.score} pts</div>}
                      </div>
                    </div>
                  )}
                </div>
              ) : gameStatus === 'active' && !isWon && (
                <motion.button
                  className={`hover-claim-button ${claim.priority}`}
                  onClick={() => handleClaim(claim.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{
                    opacity: 1,
                    pointerEvents: 'auto',
                    visibility: 'visible',
                    display: 'flex'
                  }}
                >
                  Claim
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="claims-info">
        <div className="info-item">
          <span>Quick Claims</span>
        </div>
        <div className="info-item">
          <span>Instant Validation</span>
        </div>
        <div className="info-item">
          <span>First Wins</span>
        </div>
      </div>
    </div>
  );
};

export default ClaimsPanel;