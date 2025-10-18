import React from "react";
import { motion } from "framer-motion";
import "./AvatarSelector.css";

// Curated list of 10 popular avatars
const avatars = [
  "🎯", "🏆", "⚡", "🔥", "💎", 
  "🦸", "🧙", "👑", "🚀", "🌟"
];

const AvatarSelector = ({ selectedAvatar, onSelectAvatar, onClose }) => {
  return (
    <>
      <motion.div
        className="avatar-backdrop-new"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div
        className="avatar-selector-new"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="avatar-header-new">
          <div className="avatar-title-section">
            <h3>Choose Your Avatar</h3>
            <p>Pick an avatar that represents you</p>
          </div>
          <button 
            className="close-btn-new" 
            onClick={onClose} 
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="avatar-categories">
          <div className="avatar-grid-new">
            {avatars.map((avatar, index) => (
              <motion.div
                key={avatar + index}
                className={`avatar-option-new ${selectedAvatar === avatar ? "selected" : ""}`}
                onClick={() => onSelectAvatar(avatar)}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <span className="avatar-emoji">{avatar}</span>
                {selectedAvatar === avatar && (
                  <motion.div
                    className="selection-indicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AvatarSelector;
