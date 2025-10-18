# 🎲 Multiplayer Tambola (Housie) Game

A real-time multiplayer Tambola/Housie game built with React, Node.js, and Socket.IO. Players can join game rooms, get unique tickets, and compete for various winning patterns!

## ✨ Features

### 🎮 Game Features
- **Multiplayer Support**: Up to 6 players per game room
- **Real-time Gameplay**: Live number calling and instant updates
- **Multiple Winning Patterns**: First Five, Lines, Four Corners, Full House
- **Instant Validation**: Server-side claim verification
- **Auto-game Management**: Games start automatically when 6 players join

### 🎨 UI Features
- **Responsive Design**: Works on desktop and mobile
- **Animated Interactions**: Smooth animations with Framer Motion
- **Avatar Selection**: Choose from 24+ fun avatars
- **Real-time Notifications**: Toast messages for game events
- **Visual Indicators**: Clear marking of called/missed numbers

### 🔧 Technical Features
- **WebSocket Communication**: Real-time bidirectional communication
- **Cross-platform**: Web-based, works on any device
- **Anti-cheating**: Server controls all game logic
- **Scalable Architecture**: Supports multiple concurrent games

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tambola-game
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

1. **Start the server** (in one terminal)
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:3001`

2. **Start the frontend** (in another terminal)
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open multiple browser tabs/windows** to simulate multiple players

## 🎯 How to Play

1. **Join Game**: Enter your nickname and choose an avatar
2. **Wait for Players**: Game starts when 6 players join
3. **Mark Numbers**: Click numbers on your ticket as they're called
4. **Claim Patterns**: Click "Claim" buttons when you complete patterns:
   - **First Five**: First 5 numbers marked
   - **Top/Middle/Bottom Line**: Complete any line
   - **Four Corners**: All corner numbers of your ticket
   - **Full House**: Complete ticket (ends the game)

## 🏗️ Project Structure

```
tambola-game/
├── src/                          # Frontend source
│   ├── components/              # React components
│   │   ├── LandingPage.jsx     # Entry page with player setup
│   │   ├── GameScreen.jsx      # Main game interface
│   │   ├── TambolaBoard.jsx    # Number calling board
│   │   ├── PlayerTicket.jsx    # Player's game ticket
│   │   ├── PlayersList.jsx     # Connected players list
│   │   ├── ClaimsPanel.jsx     # Winning patterns panel
│   │   ├── AvatarSelector.jsx  # Avatar selection
│   │   └── NotificationSystem.jsx # Toast notifications
│   ├── context/
│   │   └── GameContext.jsx     # Global state management
│   ├── App.jsx                 # Main app component
│   └── main.jsx               # App entry point
├── server/                     # Backend source
│   ├── server.js              # Express + Socket.IO server
│   └── package.json           # Server dependencies
├── public/                     # Static assets
└── package.json               # Frontend dependencies
```

## 🛠️ Technologies Used

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Socket.IO Client** - Real-time communication
- **Framer Motion** - Animations and transitions
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - WebSocket communication
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

## 🎨 Game Rules & Patterns

### Winning Patterns
1. **First Five** (5 points): Mark any 5 numbers first
2. **Top Line** (10 points): Complete entire top row
3. **Middle Line** (10 points): Complete entire middle row  
4. **Bottom Line** (10 points): Complete entire bottom row
5. **Four Corners** (15 points): Mark all 4 corner numbers
6. **Full House** (25 points): Complete entire ticket

### Ticket Structure
- 3 rows × 9 columns grid
- Each row has exactly 5 numbers
- Numbers distributed by columns:
  - Column 1: 1-9
  - Column 2: 10-19
  - Column 3: 20-29
  - Column 4: 30-39
  - Column 5: 40-49
  - Column 6: 50-59
  - Column 7: 60-69
  - Column 8: 70-79
  - Column 9: 80-90

## 🔧 Development

### Development Mode
```bash
# Frontend (with hot reload)
npm run dev

# Server (with auto-restart)
cd server
npm run dev  # if you install nodemon
```

### Building for Production
```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Lint code
npm run lint
```

## 🌟 Features Roadmap

- [ ] **Spectator Mode**: Watch ongoing games
- [ ] **Game History**: View past game results
- [ ] **Custom Themes**: Different visual themes
- [ ] **Sound Effects**: Audio feedback for events
- [ ] **Player Statistics**: Win/loss tracking
- [ ] **Private Rooms**: Password-protected games
- [ ] **Tournament Mode**: Multi-round competitions
- [ ] **Mobile App**: Native iOS/Android apps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Built with ❤️ for the love of Tambola/Housie
- Inspired by traditional Indian Housie games
- Thanks to the open-source community for amazing tools

---

**Have fun playing Tambola! 🎲🎯**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
