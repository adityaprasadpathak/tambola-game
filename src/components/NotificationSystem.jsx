import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useGame } from '../context/GameContext';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const { notifications, removeNotification } = useGame();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      case 'number':
        return Info;
      default:
        return Info;
    }
  };

  return (
    <div className="notification-system">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              className={`notification ${notification.type}`}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.3 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              layout
            >
              <div className="notification-content">
                <div className="notification-icon">
                  <Icon size={20} />
                </div>
                <div className="notification-message">
                  {notification.message}
                </div>
                <button
                  className="notification-close"
                  onClick={() => removeNotification(notification.id)}
                >
                  <X size={16} />
                </button>
              </div>
              
              {notification.duration && (
                <motion.div
                  className="notification-progress"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: notification.duration / 1000, ease: "linear" }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;