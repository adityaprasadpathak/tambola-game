import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests from any origin in dev for easier LAN/mobile testing
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: false
  }
});

// Allow all origins in dev (adjust for production with explicit whitelist)
app.use(cors());
app.use(express.json());

// Game state management
const games = new Map();
const waitingPlayers = [];

// Tambola ticket generation
function generateTambolaTicket() {
  const ticket = Array(3).fill().map(() => Array(9).fill(0));
  
  // Define number ranges for each column
  const ranges = [
    [1, 9], [10, 19], [20, 29], [30, 39], [40, 49], 
    [50, 59], [60, 69], [70, 79], [80, 90]
  ];
  
  // Fill each row with 5 random numbers
  for (let row = 0; row < 3; row++) {
    const selectedCols = [];
    while (selectedCols.length < 5) {
      const col = Math.floor(Math.random() * 9);
      if (!selectedCols.includes(col)) {
        selectedCols.push(col);
      }
    }
    
    selectedCols.forEach(col => {
      let num;
      do {
        num = Math.floor(Math.random() * (ranges[col][1] - ranges[col][0] + 1)) + ranges[col][0];
      } while (ticket.some(row => row[col] === num));
      
      ticket[row][col] = num;
    });
  }
  
  return ticket;
}

// Check winning patterns
function checkPattern(ticket, calledNumbers, pattern) {
  switch (pattern) {
    case 'FIRST_FIVE':
      return calledNumbers.filter(num => 
        ticket.flat().filter(n => n !== 0).includes(num)
      ).length >= 5;
    
    case 'TOP_LINE':
      return ticket[0].filter(n => n !== 0).every(num => calledNumbers.includes(num));
    
    case 'MIDDLE_LINE':
      return ticket[1].filter(n => n !== 0).every(num => calledNumbers.includes(num));
    
    case 'BOTTOM_LINE':
      return ticket[2].filter(n => n !== 0).every(num => calledNumbers.includes(num));
    
    case 'FOUR_CORNERS':
      const corners = [
        ticket[0].find(n => n !== 0),
        ticket[0].slice().reverse().find(n => n !== 0),
        ticket[2].find(n => n !== 0),
        ticket[2].slice().reverse().find(n => n !== 0)
      ];
      return corners.every(num => calledNumbers.includes(num));
    
    case 'FULL_HOUSE':
      return ticket.flat().filter(n => n !== 0).every(num => calledNumbers.includes(num));
    
    default:
      return false;
  }
}

class TambolaGame {
  constructor(gameId) {
    this.gameId = gameId;
    this.players = [];
    this.status = 'waiting'; // waiting, active, completed
    this.startGameRequested = false; // manual start flag
    this.calledNumbers = [];
    this.currentNumber = null;
    this.winners = {
      FIRST_FIVE: null,
      TOP_LINE: null,
      MIDDLE_LINE: null,
      BOTTOM_LINE: null,
      FOUR_CORNERS: null,
      FULL_HOUSE: null
    };
    this.numberCallInterval = null;
    this.availableNumbers = Array.from({length: 90}, (_, i) => i + 1);
  }

  addPlayer(player) {
  const MAX_PLAYERS = 6; // original cap
  // Default back to 6 so game waits for full lobby unless overridden via MIN_PLAYERS env var
  const MIN_PLAYERS_TO_START = parseInt(process.env.MIN_PLAYERS || '6', 10); // allow override
    if (this.players.length < MAX_PLAYERS && this.status === 'waiting') {
      this.players.push({
        ...player,
        ticket: generateTambolaTicket(),
        markedNumbers: []
      });
      // Only notify; do not auto-start until explicit request AND threshold met
      if (this.players.length < MIN_PLAYERS_TO_START) {
        // Inform lobby about player count progress
        io.to(this.gameId).emit('notification', {
          type: 'info',
          message: `Player joined (${this.players.length}/${MIN_PLAYERS_TO_START}). Waiting for ${MIN_PLAYERS_TO_START - this.players.length} more...`
        });
      } else {
        io.to(this.gameId).emit('notification', {
          type: 'success',
          message: `Minimum players reached. Starting game...`
        });
        this.startGame();
        io.to(this.gameId).emit('gameUpdate', this.getGameState());
      }
      return true;
    }
    return false;
  }

  removePlayer(socketId) {
    this.players = this.players.filter(p => p.socketId !== socketId);
    if (this.players.length === 0) {
      this.endGame();
    }
  }

  startGame() {
    if (this.status !== 'waiting') return;
    this.status = 'active';
    this.callNextNumber();
    // Inform all players in room that game has started
    io.to(this.gameId).emit('notification', { type: 'info', message: 'Game started!' });
  }

  callNextNumber() {
    if (this.availableNumbers.length === 0 || this.status !== 'active') {
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.availableNumbers.length);
    this.currentNumber = this.availableNumbers.splice(randomIndex, 1)[0];
    this.calledNumbers.push(this.currentNumber);

    // Broadcast the number to all players
    io.to(this.gameId).emit('numberCalled', {
      number: this.currentNumber,
      calledNumbers: this.calledNumbers
    });

    // Schedule next number call (every 5 seconds)
    this.numberCallInterval = setTimeout(() => {
      this.callNextNumber();
    }, 5000);
  }

  validateClaim(playerId, pattern) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, message: 'Player not found' };
    }

    // Check if pattern is already claimed by this player
    if (this.winners[pattern] && this.winners[pattern].some(w => w.playerId === playerId)) {
      return { success: false, message: 'Already claimed by you' };
    }

    const isValid = checkPattern(player.ticket, this.calledNumbers, pattern);
    
    if (isValid) {
      // Initialize winners array for this pattern if not exists
      if (!this.winners[pattern]) {
        this.winners[pattern] = [];
      }

      // Add this player as winner
      const winner = {
        playerId: player.id,
        playerName: player.name,
        avatar: player.avatar,
        timestamp: Date.now()
      };
      
      this.winners[pattern].push(winner);

      // Calculate score based on number of winners
      const patternScores = {
        'FIRST_FIVE': 100,
        'TOP_LINE': 150,
        'MIDDLE_LINE': 150,
        'BOTTOM_LINE': 150,
        'FOUR_CORNERS': 200,
        'FULL_HOUSE': 500
      };

      const baseScore = patternScores[pattern] || 100;
      const numWinners = this.winners[pattern].length;
      const playerScore = Math.floor(baseScore / numWinners);

      // Update player score
      if (!player.score) player.score = 0;
      player.score += playerScore;

      // Update scores for all previous winners of this pattern
      if (numWinners > 1) {
        this.winners[pattern].forEach(w => {
          const winnerPlayer = this.players.find(p => p.id === w.playerId);
          if (winnerPlayer && w.playerId !== playerId) {
            // Recalculate their score for this pattern
            const newScore = Math.floor(baseScore / numWinners);
            const oldScore = Math.floor(baseScore / (numWinners - 1));
            winnerPlayer.score = winnerPlayer.score - oldScore + newScore;
          }
        });
      }

      // End game if Full House is claimed
      if (pattern === 'FULL_HOUSE') {
        this.endGame();
      }

      return { 
        success: true, 
        message: `Claim validated! Score: ${playerScore}`, 
        winner: winner,
        totalWinners: numWinners,
        score: playerScore
      };
    }

    return { success: false, message: 'Pattern not completed correctly' };
  }

  endGame() {
    this.status = 'completed';
    if (this.numberCallInterval) {
      clearTimeout(this.numberCallInterval);
    }
  }

  getGameState() {
    return {
      gameId: this.gameId,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        score: p.score || 0
      })),
      status: this.status,
      calledNumbers: this.calledNumbers,
      currentNumber: this.currentNumber,
      winners: this.winners
    };
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinGame', (playerData) => {
    const player = {
      id: uuidv4(),
      socketId: socket.id,
      name: playerData.name,
      avatar: playerData.avatar,
      isHost: false
    };

    // Try to find an existing waiting game
    let game = Array.from(games.values()).find(g => g.status === 'waiting' && g.players.length < 6);
    
    // Create new game if no waiting game exists
    if (!game) {
      const gameId = uuidv4();
      game = new TambolaGame(gameId);
      games.set(gameId, game);
    }

    // Add player to game
    if (game.addPlayer(player)) {
      socket.join(game.gameId);
      socket.gameId = game.gameId;
      socket.playerId = player.id;
      // Assign host if first player
      if (game.players.length === 1) {
        game.players[0].isHost = true;
      }

      // Send game state to all players in the room
      io.to(game.gameId).emit('gameUpdate', game.getGameState());
      
      // Find the player with the ticket (it was added in addPlayer method)
      const playerWithTicket = game.players.find(p => p.id === player.id);
      
      // Send player's ticket
      console.log('Sending player ticket to:', player.name, 'Ticket:', playerWithTicket.ticket);
      socket.emit('playerTicket', {
        ticket: playerWithTicket.ticket,
        playerId: player.id,
        isHost: playerWithTicket.isHost
      });
    } else {
      socket.emit('joinError', 'Game is full or unavailable');
    }
  });

  socket.on('requestStartGame', () => {
    const game = games.get(socket.gameId);
    if (!game) return;
    const player = game.players.find(p => p.id === socket.playerId);
    const MIN_PLAYERS_TO_START = parseInt(process.env.MIN_PLAYERS || '6', 10);
    if (player && player.isHost) {
      // Allow manual start with fewer players for testing
      if (game.players.length < 1) {
        socket.emit('notification', { type: 'error', message: 'Need at least 1 player to start.' });
        return;
      }
      // Notify about testing mode if fewer than recommended players
      if (game.players.length < MIN_PLAYERS_TO_START) {
        io.to(game.gameId).emit('notification', { 
          type: 'info', 
          message: `Starting game in test mode with ${game.players.length} players...` 
        });
      }
      game.startGame();
      io.to(game.gameId).emit('gameUpdate', game.getGameState());
    } else {
      socket.emit('notification', { type: 'error', message: 'Only host can start the game.' });
    }
  });

  socket.on('markNumber', (data) => {
    const game = games.get(socket.gameId);
    if (game) {
      const player = game.players.find(p => p.id === socket.playerId);
      if (player) {
        if (!player.markedNumbers.includes(data.number)) {
          player.markedNumbers.push(data.number);
        }
      }
    }
  });

  socket.on('claimPattern', (data) => {
    const game = games.get(socket.gameId);
    if (game) {
      const result = game.validateClaim(socket.playerId, data.pattern);
      
      if (result.success) {
        // Broadcast to all players in the game
        io.to(game.gameId).emit('claimResult', {
          pattern: data.pattern,
          winner: result.winner,
          success: true,
          totalWinners: result.totalWinners,
          score: result.score,
          message: result.message
        });
        
        // Update game state with new scores
        io.to(game.gameId).emit('gameUpdate', game.getGameState());
        
        // Notification handled by claimResult event on client side
      } else {
        // Send failure only to the claiming player
        socket.emit('claimResult', {
          pattern: data.pattern,
          success: false,
          message: result.message
        });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.gameId) {
      const game = games.get(socket.gameId);
      if (game) {
        game.removePlayer(socket.id);
        
        if (game.players.length === 0) {
          games.delete(socket.gameId);
        } else {
          io.to(game.gameId).emit('gameUpdate', game.getGameState());
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Tambola game server running on port ${PORT}`);
});