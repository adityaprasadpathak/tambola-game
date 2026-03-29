import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

const initialState = {
  socket:          null,
  player:          null,
  gameState:       null,
  playerTicket:    null,
  isConnected:     false,
  connectionError: null,
  lastSocketUrl:   null,
  notifications:   [],
  currentNumber:   null,
  calledNumbers:   [],
  winners:         {}
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_CONNECTION_ERROR':
      return { ...state, connectionError: action.payload };
    case 'SET_SOCKET_URL':
      return { ...state, lastSocketUrl: action.payload };
    case 'SET_PLAYER':
      return { ...state, player: action.payload };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'SET_PLAYER_TICKET':
      return { ...state, playerTicket: action.payload };
    case 'UPDATE_CALLED_NUMBERS':
      return {
        ...state,
        calledNumbers: action.payload.calledNumbers,
        currentNumber: action.payload.number
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'UPDATE_WINNERS':
      return { ...state, winners: { ...state.winners, ...action.payload } };
    case 'RESET_GAME':
      return { ...initialState, socket: state.socket, isConnected: state.isConnected };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  // Use a ref to hold the latest player so socket callbacks don't capture stale state
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current = state.player;
  }, [state.player]);

  useEffect(() => {
    const host       = window.location.hostname;
    const protocol   = window.location.protocol;
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `${protocol}//${host}:3001`;

    dispatch({ type: 'SET_SOCKET_URL', payload: SOCKET_URL });

    const socket = io(SOCKET_URL, {
      transports:           ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay:    1000
    });

    dispatch({ type: 'SET_SOCKET', payload: socket });

    // ── Connection lifecycle ────────────────────────────────────────────────
    socket.on('connect',    () => dispatch({ type: 'SET_CONNECTED', payload: true }));
    socket.on('disconnect', () => dispatch({ type: 'SET_CONNECTED', payload: false }));

    const onError = label => err => {
      dispatch({ type: 'SET_CONNECTION_ERROR', payload: `${label}: ${err?.message || err}` });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id: Date.now(), type: 'error', message: 'Connection issue. Retrying…', duration: 4000 }
      });
    };

    socket.io.on('error',           onError('io_error'));
    socket.io.on('reconnect_error', onError('reconnect_error'));
    socket.on('connect_error',      onError('connect_error'));
    socket.on('error',              onError('socket_error'));

    // ── Game events ─────────────────────────────────────────────────────────
    socket.on('gameUpdate', gameState => {
      dispatch({ type: 'SET_GAME_STATE', payload: gameState });
    });

    socket.on('playerTicket', data => {
      dispatch({ type: 'SET_PLAYER_TICKET', payload: data });
      // Use ref to avoid stale closure on state.player
      if (data.isHost && playerRef.current) {
        dispatch({ type: 'SET_PLAYER', payload: { ...playerRef.current, isHost: true } });
      }
    });

    socket.on('numberCalled', data => {
      dispatch({ type: 'UPDATE_CALLED_NUMBERS', payload: data });
    });

    socket.on('claimResult', data => {
      if (data.success) {
        const winnerWithScore = Array.isArray(data.winner)
          ? data.winner.map(w => ({ ...w, score: data.score }))
          : { ...data.winner, score: data.score };

        dispatch({ type: 'UPDATE_WINNERS', payload: { [data.pattern]: winnerWithScore } });

        const patternName  = data.pattern.replace(/_/g, ' ').toLowerCase();
        const scoreMessage = data.totalWinners > 1
          ? `${data.winner.playerName} claimed ${patternName}! Score split: ${data.score} pts (${data.totalWinners} winners)`
          : `${data.winner.playerName} claimed ${patternName} for ${data.score} pts!`;

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { id: Date.now(), type: 'success', message: scoreMessage, duration: 5000 }
        });
      } else {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { id: Date.now(), type: 'error', message: data.message || 'Invalid claim', duration: 3000 }
        });
      }
    });

    socket.on('joinError', message => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id: Date.now(), type: 'error', message, duration: 5000 }
      });
    });

    socket.on('notification', data => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id:       Date.now(),
          type:     data.type || 'info',
          message:  data.message,
          duration: data.duration || 5000
        }
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  // Auto-remove notifications after their duration
  useEffect(() => {
    const timers = state.notifications
      .filter(n => n.duration)
      .map(n =>
        setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: n.id }), n.duration)
      );
    return () => timers.forEach(clearTimeout);
  }, [state.notifications]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const joinGame = playerData => {
    if (!state.socket) return;
    dispatch({ type: 'SET_PLAYER', payload: playerData });
    state.socket.emit('joinGame', playerData);
  };

  const markNumber = number => {
    if (state.socket) state.socket.emit('markNumber', { number });
  };

  const claimPattern = pattern => {
    if (state.socket) {
      state.socket.emit('claimPattern', { pattern });
    } else {
      console.error('[GameContext] No socket connection for claimPattern');
    }
  };

  const startGame = () => {
    if (state.socket) state.socket.emit('requestStartGame');
  };

  const removeNotification = id => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const value = {
    ...state,
    joinGame,
    markNumber,
    claimPattern,
    startGame,
    removeNotification
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};