import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import LandingPage from './components/LandingPage';
import GameScreen from './components/GameScreen';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/game" element={<GameScreen />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
