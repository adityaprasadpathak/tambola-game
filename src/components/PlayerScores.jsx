import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, Star, Users } from 'lucide-react';
import './PlayerScores.css';

// Compute total score for each player from winners map
function computeScores(players, winners) {
  return (players || []).map(player => {
    let totalScore = 0;
    Object.values(winners || {}).forEach(winner => {
      if (Array.isArray(winner)) {
        winner.forEach(w => { if (w.playerId === player.id) totalScore += w.score || 0; });
      } else if (winner?.playerId === player.id) {
        totalScore += winner.score || 0;
      }
    });
    return { ...player, totalScore };
  }).sort((a, b) => b.totalScore - a.totalScore);
}

const RANK_CONFIG = {
  0: { icon: <Crown size={13} />, label: 'gold',   color: '#ffd700' },
  1: { icon: <Trophy size={13} />, label: 'silver', color: '#c0c0c0' },
  2: { icon: <Star size={13} />,  label: 'bronze', color: '#cd7f32' }
};

const PlayerScores = ({ players, currentPlayer, winners }) => {
  const ranked = computeScores(players, winners);

  return (
    <div className="player-scores-panel">
      <div className="ps-header">
        <Users size={14} className="ps-header-icon" />
        <h3>Leaderboard</h3>
        <div className="ps-count">{ranked.length}/6</div>
      </div>

      <div className="ps-list">
        <AnimatePresence>
          {ranked.map((player, index) => {
            const isMe     = player.id === currentPlayer?.id;
            const rankConf = RANK_CONFIG[index];
            const hasScore = player.totalScore > 0;
            const display  = player.name?.length > 10
              ? player.name.substring(0, 10) + '…'
              : player.name;

            return (
              <motion.div
                key={player.id}
                layout
                className={`ps-card ${rankConf?.label ?? 'regular'} ${isMe ? 'me' : ''}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05, layout: { duration: 0.3 } }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Rank badge */}
                <div
                  className="ps-rank"
                  style={{ color: rankConf?.color ?? 'rgba(255,255,255,0.4)' }}
                >
                  {rankConf && hasScore ? rankConf.icon : <span className="ps-rank-num">#{index + 1}</span>}
                </div>

                {/* Avatar */}
                <div className="ps-avatar">{player.avatar}</div>

                {/* Name & score */}
                <div className="ps-info">
                  <div className="ps-name">
                    {display}
                    {isMe && <span className="ps-you">YOU</span>}
                  </div>
                  <div className="ps-score" style={{ color: rankConf?.color ?? 'rgba(255,255,255,0.6)' }}>
                    {player.totalScore > 0 ? `${player.totalScore} pts` : '—'}
                  </div>
                </div>

                {/* Online dot */}
                <div className="ps-online" />

                {/* Active player shimmer */}
                {isMe && <div className="ps-me-glow" />}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 6 - ranked.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="ps-card empty">
            <div className="ps-rank"><span className="ps-rank-num">#{ranked.length + i + 1}</span></div>
            <div className="ps-avatar ps-avatar-empty">?</div>
            <div className="ps-info">
              <div className="ps-name empty-name">Waiting…</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerScores;