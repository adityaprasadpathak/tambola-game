import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, ArrowUp, ArrowDown, Minus, Award, Crown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import './ClaimsPanel.css';

// ── Claim-type icon components ────────────────────────────────────────────
const FirstFiveIcon = () => (
  <motion.div
    className="claim-icon-container"
    whileHover={{ scale: 1.2 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <motion.div
      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Zap size={16} style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />
    </motion.div>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ delay: 0.5, duration: 0.6, ease: 'backOut' }}
      style={{
        position: 'absolute', top: '-6px', right: '-10px',
        fontSize: '9px', fontWeight: '900',
        background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
        borderRadius: '50%', width: '14px', height: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', boxShadow: '0 2px 8px rgba(255,107,53,0.5)'
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
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
  >
    <motion.div
      animate={{ scaleX: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: '16px', height: '3px', background: 'linear-gradient(90deg, transparent, currentColor, transparent)', borderRadius: '2px', boxShadow: '0 0 6px currentColor' }}
    />
    <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}>
      <ArrowUp size={12} style={{ filter: 'drop-shadow(0 0 3px currentColor)' }} />
    </motion.div>
  </motion.div>
);

const MiddleLineIcon = () => (
  <motion.div
    className="claim-icon-container"
    whileHover={{ scale: 1.2 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <motion.div
      animate={{ scaleX: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: '18px', height: '3px', background: 'linear-gradient(90deg, transparent, currentColor, currentColor, transparent)', borderRadius: '2px', boxShadow: '0 0 8px currentColor', position: 'relative' }}
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '4px', height: '4px', background: 'currentColor', borderRadius: '50%', boxShadow: '0 0 4px currentColor' }} />
    </motion.div>
  </motion.div>
);

const BottomLineIcon = () => (
  <motion.div
    className="claim-icon-container"
    whileHover={{ scale: 1.2, y: 2 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
  >
    <motion.div animate={{ y: [0, 2, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}>
      <ArrowDown size={12} style={{ filter: 'drop-shadow(0 0 3px currentColor)' }} />
    </motion.div>
    <motion.div
      animate={{ scaleX: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: '16px', height: '3px', background: 'linear-gradient(90deg, transparent, currentColor, transparent)', borderRadius: '2px', boxShadow: '0 0 6px currentColor' }}
    />
  </motion.div>
);

const FourCornersIcon = () => (
  <motion.div
    className="claim-icon-container"
    whileHover={{ scale: 1.2, rotate: 5 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    style={{ position: 'relative', width: '18px', height: '18px' }}
  >
    {[
      { top: '1px', left: '1px',   delay: 0 },
      { top: '1px', right: '1px',  delay: 0.1 },
      { bottom: '1px', left: '1px',  delay: 0.2 },
      { bottom: '1px', right: '1px', delay: 0.3 }
    ].map((pos, i) => (
      <motion.div
        key={i}
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.2, delay: pos.delay, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', ...pos, width: '4px', height: '4px', background: 'radial-gradient(circle, currentColor, transparent)', borderRadius: '50%', boxShadow: '0 0 6px currentColor' }}
      />
    ))}
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '8px', height: '8px', border: '1.5px solid currentColor', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 4px currentColor' }}
    />
  </motion.div>
);

const FullHouseIcon = () => (
  <motion.div
    className="claim-icon-container"
    whileHover={{ scale: 1.3 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <motion.div
      animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Award size={16} style={{ filter: 'drop-shadow(0 0 6px currentColor)', color: 'inherit' }} />
    </motion.div>
    <motion.div
      animate={{ y: [0, -1, 0], rotate: [0, 5, -5, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      style={{ position: 'absolute', top: '-6px', right: '-4px', filter: 'drop-shadow(0 0 4px #ffd700)' }}
    >
      <Crown size={10} style={{ color: '#ffd700' }} />
    </motion.div>
  </motion.div>
);

// ── Claim type definitions ────────────────────────────────────────────────
const CLAIM_TYPES = [
  {
    id:          'FIRST_FIVE',
    name:        'First Five',
    description: '⚡ First 5 numbers called',
    icon:        FirstFiveIcon,
    color:       '#ff9800',
    iconBg:      'rgba(255,152,0,0.15)',
    priority:    'high'
  },
  {
    id:          'TOP_LINE',
    name:        'Top Line',
    description: '📏 Complete top row',
    icon:        TopLineIcon,
    color:       '#2196f3',
    iconBg:      'rgba(33,150,243,0.15)',
    priority:    'medium'
  },
  {
    id:          'MIDDLE_LINE',
    name:        'Middle Line',
    description: '🎯 Complete middle row',
    icon:        MiddleLineIcon,
    color:       '#4caf50',
    iconBg:      'rgba(76,175,80,0.15)',
    priority:    'medium'
  },
  {
    id:          'BOTTOM_LINE',
    name:        'Bottom Line',
    description: '📐 Complete bottom row',
    icon:        BottomLineIcon,
    color:       '#9c27b0',
    iconBg:      'rgba(156,39,176,0.15)',
    priority:    'medium'
  },
  {
    id:          'FOUR_CORNERS',
    name:        'Four Corners',
    description: '💎 All corner numbers',
    icon:        FourCornersIcon,
    color:       '#e91e63',
    iconBg:      'rgba(233,30,99,0.15)',
    priority:    'high'
  },
  {
    id:          'FULL_HOUSE',
    name:        'Full House',
    description: '👑 Complete entire ticket',
    icon:        FullHouseIcon,
    color:       '#ffd700',
    iconBg:      'rgba(255,215,0,0.15)',
    priority:    'ultimate'
  }
];

// ── Component ─────────────────────────────────────────────────────────────
const ClaimsPanel = ({ winners, gameStatus }) => {
  const { claimPattern } = useGame();

  const handleClaim = claimId => {
    if (gameStatus === 'active' && !winners[claimId]) {
      claimPattern(claimId);
    }
  };

  const sortedClaims = [...CLAIM_TYPES].sort((a, b) => {
    const aWon = !!winners[a.id];
    const bWon = !!winners[b.id];
    if (aWon === bWon) return 0;
    return aWon ? 1 : -1;
  });

  return (
    <div className="claims-panel">
      <h3>Claims &amp; Prizes</h3>
      <div className="claims-container">
        {sortedClaims.map((claim, index) => {
          const winner = winners[claim.id];
          const isWon  = !!winner;
          const Icon   = claim.icon;

          return (
            <motion.div
              key={claim.id}
              className={`claim-card ${isWon ? 'won' : 'available'}`}
              data-claim-type={claim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={!isWon && gameStatus === 'active' ? { scale: 1.02 } : {}}
            >
              <div className="claim-header">
                <div className="claim-icon" style={{ backgroundColor: claim.iconBg, color: claim.color }}>
                  <Icon size={16} />
                </div>
                <div className="claim-info">
                  <div className="claim-name" style={{ color: claim.color }}>{claim.name}</div>
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
                  {(Array.isArray(winner) ? winner : [winner]).map(w => (
                    <div key={w.playerId} className="winner-info">
                      <div className="winner-avatar">{w.avatar}</div>
                      <div className="winner-details">
                        <div className="winner-name">{w.playerName}</div>
                        {w.score && <div className="winner-score">{w.score} pts</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : gameStatus === 'active' && (
                <motion.button
                  className={`hover-claim-button ${claim.priority}`}
                  onClick={() => handleClaim(claim.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  Claim
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="claims-info">
        <div className="info-item"><span>Quick Claims</span></div>
        <div className="info-item"><span>Instant Validation</span></div>
        <div className="info-item"><span>First Wins</span></div>
      </div>
    </div>
  );
};

export default ClaimsPanel;