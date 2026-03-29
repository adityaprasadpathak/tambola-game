import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app    = express();
const server = createServer(app);
const io     = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true), // open in dev; restrict in prod
    methods: ['GET', 'POST'],
    credentials: false
  }
});

app.use(cors());
app.use(express.json());

// ── Constants ──────────────────────────────────────────────────────────────
const MAX_PLAYERS         = 6;
const MIN_PLAYERS_TO_START = parseInt(process.env.MIN_PLAYERS || '6', 10);

const PATTERN_SCORES = {
  FIRST_FIVE:  100,
  TOP_LINE:    150,
  MIDDLE_LINE: 150,
  BOTTOM_LINE: 150,
  FOUR_CORNERS: 200,
  FULL_HOUSE:  500
};

// ── Helper: sanitize player name ────────────────────────────────────────────
function sanitizeName(raw) {
  if (typeof raw !== 'string') return 'Player';
  return raw.trim().substring(0, 18).replace(/[<>"'&]/g, '') || 'Player';
}

// ── Ticket generation ────────────────────────────────────────────────────────
function generateTambolaTicket() {
  const ticket = Array(3).fill(null).map(() => Array(9).fill(0));

  const ranges = [
    [1, 9],   [10, 19], [20, 29], [30, 39], [40, 49],
    [50, 59], [60, 69], [70, 79], [80, 90]
  ];

  for (let row = 0; row < 3; row++) {
    const selectedCols = [];
    while (selectedCols.length < 5) {
      const col = Math.floor(Math.random() * 9);
      if (!selectedCols.includes(col)) selectedCols.push(col);
    }

    selectedCols.forEach(col => {
      let num;
      do {
        num = Math.floor(Math.random() * (ranges[col][1] - ranges[col][0] + 1)) + ranges[col][0];
      } while (ticket.some(r => r[col] === num)); // renamed inner var to 'r' to avoid shadowing
      ticket[row][col] = num;
    });
  }

  return ticket;
}

// ── Win-pattern checker ──────────────────────────────────────────────────────
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

    case 'FOUR_CORNERS': {
      const corners = [
        ticket[0].find(n => n !== 0),
        ticket[0].slice().reverse().find(n => n !== 0),
        ticket[2].find(n => n !== 0),
        ticket[2].slice().reverse().find(n => n !== 0)
      ];
      return corners.every(num => calledNumbers.includes(num));
    }

    case 'FULL_HOUSE':
      return ticket.flat().filter(n => n !== 0).every(num => calledNumbers.includes(num));

    default:
      return false;
  }
}

// ── Game class ───────────────────────────────────────────────────────────────
class TambolaGame {
  constructor(gameId) {
    this.gameId              = gameId;
    this.players             = [];
    this.status              = 'waiting'; // waiting | active | completed
    this.calledNumbers       = [];
    this.currentNumber       = null;
    this.winners             = {
      FIRST_FIVE:   null,
      TOP_LINE:     null,
      MIDDLE_LINE:  null,
      BOTTOM_LINE:  null,
      FOUR_CORNERS: null,
      FULL_HOUSE:   null
    };
    this.numberCallInterval  = null;
    this.availableNumbers    = Array.from({ length: 90 }, (_, i) => i + 1);
  }

  addPlayer(player) {
    if (this.players.length >= MAX_PLAYERS || this.status !== 'waiting') return false;

    this.players.push({ ...player, ticket: generateTambolaTicket(), markedNumbers: [] });

    const count     = this.players.length;
    const remaining = MIN_PLAYERS_TO_START - count;

    if (count < MIN_PLAYERS_TO_START) {
      io.to(this.gameId).emit('notification', {
        type:    'info',
        message: `Player joined (${count}/${MIN_PLAYERS_TO_START}). Waiting for ${remaining} more…`
      });
    } else {
      io.to(this.gameId).emit('notification', {
        type:    'success',
        message: 'Minimum players reached. Starting game…'
      });
      this.startGame();
      io.to(this.gameId).emit('gameUpdate', this.getGameState());
    }
    return true;
  }

  removePlayer(socketId) {
    this.players = this.players.filter(p => p.socketId !== socketId);
    if (this.players.length === 0) this.endGame();
  }

  startGame() {
    if (this.status !== 'waiting') return;
    this.status = 'active';
    io.to(this.gameId).emit('notification', { type: 'info', message: 'Game started! 🎱' });
    this.callNextNumber();
  }

  callNextNumber() {
    if (this.availableNumbers.length === 0 || this.status !== 'active') return;

    const idx            = Math.floor(Math.random() * this.availableNumbers.length);
    this.currentNumber   = this.availableNumbers.splice(idx, 1)[0];
    this.calledNumbers.push(this.currentNumber);

    io.to(this.gameId).emit('numberCalled', {
      number:        this.currentNumber,
      calledNumbers: this.calledNumbers
    });

    this.numberCallInterval = setTimeout(() => this.callNextNumber(), 5000);
  }

  validateClaim(playerId, pattern) {
    if (!Object.prototype.hasOwnProperty.call(this.winners, pattern)) {
      return { success: false, message: 'Invalid pattern' };
    }

    const player = this.players.find(p => p.id === playerId);
    if (!player) return { success: false, message: 'Player not found' };

    const existingWinners = this.winners[pattern];
    if (Array.isArray(existingWinners) && existingWinners.some(w => w.playerId === playerId)) {
      return { success: false, message: 'Already claimed by you' };
    }

    if (!checkPattern(player.ticket, this.calledNumbers, pattern)) {
      return { success: false, message: 'Pattern not completed correctly' };
    }

    // First win for this pattern — initialise array
    if (!Array.isArray(this.winners[pattern])) {
      this.winners[pattern] = [];
    }

    const winner = {
      playerId:   player.id,
      playerName: player.name,
      avatar:     player.avatar,
      timestamp:  Date.now()
    };
    this.winners[pattern].push(winner);

    const numWinners  = this.winners[pattern].length;
    const baseScore   = PATTERN_SCORES[pattern] || 100;
    const playerScore = Math.floor(baseScore / numWinners);

    if (!player.score) player.score = 0;
    player.score += playerScore;

    // Re-distribute previous winners' score share if there are multiple winners
    if (numWinners > 1) {
      this.winners[pattern].forEach(w => {
        const wp = this.players.find(p => p.id === w.playerId);
        if (wp && w.playerId !== playerId) {
          const oldShare = Math.floor(baseScore / (numWinners - 1));
          wp.score = (wp.score || 0) - oldShare + playerScore;
        }
      });
    }

    if (pattern === 'FULL_HOUSE') this.endGame();

    return {
      success:      true,
      message:      `Claim validated! Score: ${playerScore}`,
      winner,
      totalWinners: numWinners,
      score:        playerScore
    };
  }

  endGame() {
    this.status = 'completed';
    if (this.numberCallInterval) clearTimeout(this.numberCallInterval);
  }

  getGameState() {
    return {
      gameId:        this.gameId,
      players:       this.players.map(p => ({
        id:     p.id,
        name:   p.name,
        avatar: p.avatar,
        score:  p.score || 0
      })),
      status:        this.status,
      calledNumbers: this.calledNumbers,
      currentNumber: this.currentNumber,
      winners:       this.winners
    };
  }
}

// ── Game registry ────────────────────────────────────────────────────────────
const games = new Map();

// ── REST endpoints ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/status', (_req, res) => {
  let totalPlayers = 0;
  games.forEach(g => { totalPlayers += g.players.length; });
  res.json({
    activeGames:  games.size,
    totalPlayers,
    minPlayers:   MIN_PLAYERS_TO_START,
    maxPlayers:   MAX_PLAYERS
  });
});

// ── Socket.IO handlers ───────────────────────────────────────────────────────
io.on('connection', socket => {
  console.log(`[+] Connected: ${socket.id}`);

  // ── joinGame ──────────────────────────────────────────────────────────────
  socket.on('joinGame', playerData => {
    const name   = sanitizeName(playerData?.name);
    const avatar = typeof playerData?.avatar === 'string'
      ? playerData.avatar.substring(0, 8)
      : '🎯';

    const player = {
      id:       uuidv4(),
      socketId: socket.id,
      name,
      avatar,
      isHost:   false
    };

    // Find an open waiting game
    let game = Array.from(games.values()).find(
      g => g.status === 'waiting' && g.players.length < MAX_PLAYERS
    );

    if (!game) {
      const gameId = uuidv4();
      game         = new TambolaGame(gameId);
      games.set(gameId, game);
    }

    if (game.addPlayer(player)) {
      socket.join(game.gameId);
      socket.gameId   = game.gameId;
      socket.playerId = player.id;

      // First player in is host
      if (game.players.length === 1) game.players[0].isHost = true;

      io.to(game.gameId).emit('gameUpdate', game.getGameState());

      const joined = game.players.find(p => p.id === player.id);
      socket.emit('playerTicket', {
        ticket:   joined.ticket,
        playerId: player.id,
        isHost:   joined.isHost
      });
    } else {
      socket.emit('joinError', 'Game is full or unavailable');
    }
  });

  // ── requestStartGame ──────────────────────────────────────────────────────
  socket.on('requestStartGame', () => {
    const game = games.get(socket.gameId);
    if (!game) return;

    const player = game.players.find(p => p.id === socket.playerId);
    if (!player?.isHost) {
      socket.emit('notification', { type: 'error', message: 'Only the host can start the game.' });
      return;
    }

    if (game.players.length < 1) {
      socket.emit('notification', { type: 'error', message: 'Need at least 1 player to start.' });
      return;
    }

    if (game.players.length < MIN_PLAYERS_TO_START) {
      io.to(game.gameId).emit('notification', {
        type:    'info',
        message: `Starting in test mode with ${game.players.length} player(s)…`
      });
    }

    game.startGame();
    io.to(game.gameId).emit('gameUpdate', game.getGameState());
  });

  // ── markNumber ───────────────────────────────────────────────────────────
  socket.on('markNumber', data => {
    const num = parseInt(data?.number, 10);
    if (!Number.isInteger(num) || num < 1 || num > 90) return;

    const game = games.get(socket.gameId);
    if (!game) return;

    const player = game.players.find(p => p.id === socket.playerId);
    if (player && !player.markedNumbers.includes(num)) {
      player.markedNumbers.push(num);
    }
  });

  // ── claimPattern ─────────────────────────────────────────────────────────
  socket.on('claimPattern', data => {
    const { pattern } = data || {};
    const game = games.get(socket.gameId);
    if (!game) return;

    const result = game.validateClaim(socket.playerId, pattern);

    if (result.success) {
      io.to(game.gameId).emit('claimResult', {
        pattern,
        winner:       result.winner,
        success:      true,
        totalWinners: result.totalWinners,
        score:        result.score,
        message:      result.message
      });
      io.to(game.gameId).emit('gameUpdate', game.getGameState());
    } else {
      socket.emit('claimResult', {
        pattern,
        success: false,
        message: result.message
      });
    }
  });

  // ── disconnect ───────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[-] Disconnected: ${socket.id}`);

    if (!socket.gameId) return;
    const game = games.get(socket.gameId);
    if (!game) return;

    game.removePlayer(socket.id);

    if (game.players.length === 0) {
      games.delete(socket.gameId);
    } else {
      io.to(game.gameId).emit('gameUpdate', game.getGameState());
    }
  });
});

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Tambola server listening on port ${PORT} | minPlayers=${MIN_PLAYERS_TO_START}`);
});