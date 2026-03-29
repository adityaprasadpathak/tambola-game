# 🎱 Tambola Game

A **real-time multiplayer Tambola (Housie/Bingo)** game built with React + Vite (frontend) and Node.js + Socket.IO (backend).

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Real-time multiplayer** | Up to 6 players via Socket.IO WebSockets |
| **Auto ticket generation** | Server-side Tambola-compliant 3×9 tickets |
| **Number calling** | Random draw every 5 seconds |
| **6 win patterns** | First Five, Top/Middle/Bottom Line, Four Corners, Full House |
| **Live leaderboard** | Animated score updates as claims are won |
| **LAN-ready** | Auto-detects server host so mobile devices work on the same network |
| **Dark premium UI** | Glassmorphic design with smooth framer-motion animations |
| **Fully responsive** | Works on mobile (360px), tablet, and desktop (1920px+) |

---

## 📁 Project Structure

```
tambola-game/
├── server/
│   ├── server.js          # Express + Socket.IO game server
│   ├── .env.example       # Server env var documentation
│   └── package.json
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx    # Home / join screen
│   │   ├── GameScreen.jsx     # Main game layout
│   │   ├── TambolaBoard.jsx   # 1-90 number grid
│   │   ├── PlayerTicket.jsx   # Player's 3×9 ticket
│   │   ├── PlayerScores.jsx   # Live leaderboard
│   │   ├── ClaimsPanel.jsx    # Pattern claim buttons
│   │   ├── NotificationSystem.jsx
│   │   └── AvatarSelector.jsx
│   ├── context/
│   │   └── GameContext.jsx    # Global state + Socket.IO handler
│   ├── App.jsx
│   ├── App.css                # Design system & global styles
│   ├── index.css              # Minimal reset
│   └── main.jsx
├── .env.example               # Frontend env var documentation
├── index.html
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm** 9+

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 2. Configure environment (optional)

```bash
# Copy and edit as needed
cp .env.example .env
cp server/.env.example server/.env
```

### 3. Start the server

```bash
# From the server/ directory
cd server
npm run dev        # nodemon (auto-reload)
# or
npm start          # plain node
```

The server starts on **http://localhost:3001** by default.

### 4. Start the frontend

```bash
# From the project root
npm run dev
```

Open **http://localhost:5173** in your browser.

### 5. Multiplayer on a LAN

1. Find your machine's local IP: `ipconfig` (Windows) or `ip a` (Linux/macOS)
2. Open the game URL on other devices using your IP, e.g. `http://192.168.1.10:5173`
3. No extra config needed — the frontend auto-connects to the correct server host.

---

## 🎮 How to Play

1. **Enter your name** and pick an avatar on the landing page.
2. Click **Enter Arena** — you'll be placed in a game lobby.
3. Once **6 players** have joined, the game starts automatically.
   - The **host** (first to join) can also click **Start Game** to begin early.
4. Numbers are called every **5 seconds** — click them on your ticket to mark.
5. When you complete a pattern, click **Claim** in the Claims panel.
6. The server validates your claim instantly and awards points.
7. The game ends when **Full House** is claimed.

### Win Patterns & Points

| Pattern | Points | Rule |
|---------|--------|------|
| First Five | 100 | Mark any 5 numbers first |
| Top Line | 150 | Complete first row |
| Middle Line | 150 | Complete middle row |
| Bottom Line | 150 | Complete bottom row |
| Four Corners | 200 | Mark the 4 corner numbers |
| Full House | 500 | Mark all 15 numbers on your ticket |

> Points are split equally among multiple winners of the same pattern.

---

## ⚙️ Environment Variables

### Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_SOCKET_URL` | Auto-detected | Override Socket.IO server URL |

### Backend (`server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `MIN_PLAYERS` | `6` | Players required to auto-start |

---

## 🔧 Available Scripts

### Frontend (root)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview production build |

### Backend (`server/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start with plain node |

---

## 🛠️ API & Health Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server uptime & status |
| `/api/status` | GET | Active games & player count |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT
