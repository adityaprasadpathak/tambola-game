import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import AvatarSelector from './AvatarSelector';
import './LandingPage.css';

// Badge component for features
const Badge = ({ children }) => (
  <motion.span
    className="lp-badge"
    whileHover={{ y: -2, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  >
    {children}
  </motion.span>
);

const LandingPage = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎯');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const navigate = useNavigate();
  const { joinGame, isConnected, connectionError, lastSocketUrl, playerTicket } = useGame();
  const [joinInProgress, setJoinInProgress] = useState(false);

  const handleJoinGame = () => {
    if (!playerName.trim() || !selectedAvatar || !isConnected || joinInProgress) return;
    setJoinInProgress(true);
    joinGame({ name: playerName.trim(), avatar: selectedAvatar });
  };

  useEffect(() => {
    if (joinInProgress && playerTicket) {
      navigate('/game');
    }
  }, [joinInProgress, playerTicket, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && playerName.trim() && isConnected) {
      handleJoinGame();
    }
  };

  return (
    <div className="landing-page">
      {/* Background layers */}
      <div className="lp-bg-glow" />
      <div className="lp-bg-noise" />
      <div className="lp-grid-overlay" />
      <div className="lp-orb orb-a" />
      <div className="lp-orb orb-b" />
      <div className="lp-orb orb-c" />

      <div className="lp-hero-layout">
        {/* Hero Section */}
        <motion.div 
          className="lp-hero-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="premium-tambola-hero">
            {/* Background Tickets */}
            <div className="hero-tickets-layer">
              <div className="premium-ticket pink-ticket">
                <div className="ticket-perforation left"></div>
                <div className="ticket-perforation right"></div>
                <div className="ticket-grid">
                  <div className="ticket-row">
                    <span>15</span><span>29</span><span>43</span><span>56</span><span>72</span>
                  </div>
                  <div className="ticket-row">
                    <span>7</span><span></span><span>38</span><span></span><span>81</span>
                  </div>
                  <div className="ticket-row">
                    <span></span><span>24</span><span></span><span>67</span><span>89</span>
                  </div>
                </div>
              </div>
              
              <div className="premium-ticket green-ticket">
                <div className="ticket-perforation left"></div>
                <div className="ticket-perforation right"></div>
                <div className="ticket-grid">
                  <div className="ticket-row">
                    <span>3</span><span></span><span>34</span><span>52</span><span></span>
                  </div>
                  <div className="ticket-row">
                    <span></span><span>28</span><span></span><span></span><span>76</span>
                  </div>
                  <div className="ticket-row">
                    <span>12</span><span></span><span>47</span><span>63</span><span>84</span>
                  </div>
                </div>
              </div>
              
              <div className="premium-ticket blue-ticket">
                <div className="ticket-perforation left"></div>
                <div className="ticket-perforation right"></div>
                <div className="ticket-grid">
                  <div className="ticket-row">
                    <span></span><span>21</span><span>35</span><span></span><span>78</span>
                  </div>
                  <div className="ticket-row">
                    <span>6</span><span></span><span></span><span>59</span><span></span>
                  </div>
                  <div className="ticket-row">
                    <span></span><span>27</span><span>41</span><span></span><span>83</span>
                  </div>
                </div>
              </div>
              
              <div className="premium-ticket yellow-ticket">
                <div className="ticket-perforation left"></div>
                <div className="ticket-perforation right"></div>
                <div className="ticket-grid">
                  <div className="ticket-row">
                    <span>11</span><span></span><span>39</span><span>54</span><span></span>
                  </div>
                  <div className="ticket-row">
                    <span></span><span>26</span><span></span><span></span><span>77</span>
                  </div>
                  <div className="ticket-row">
                    <span>4</span><span></span><span>48</span><span>62</span><span>85</span>
                  </div>
                </div>
              </div>

              {/* Additional tickets around "TAMBOLA" */}
              <div className="premium-ticket orange-ticket">
                <div className="ticket-perforation left"></div>
                <div className="ticket-perforation right"></div>
                <div className="ticket-grid">
                  <div className="ticket-row">
                    <span>2</span><span></span><span>33</span><span>51</span><span></span>
                  </div>
                  <div className="ticket-row">
                    <span></span><span>19</span><span></span><span></span><span>74</span>
                  </div>
                  <div className="ticket-row">
                    <span>8</span><span></span><span>44</span><span>68</span><span>86</span>
                  </div>
                </div>
              </div>

              <div className="premium-ticket purple-ticket">
                <div className="ticket-perforation left"></div>
                <div className="ticket-perforation right"></div>
                <div className="ticket-grid">
                  <div className="ticket-row">
                    <span>14</span><span></span><span>37</span><span></span><span>79</span>
                  </div>
                  <div className="ticket-row">
                    <span></span><span>25</span><span></span><span>58</span><span></span>
                  </div>
                  <div className="ticket-row">
                    <span>1</span><span></span><span>46</span><span></span><span>87</span>
                  </div>
                </div>
              </div>

              <div className="premium-ticket teal-ticket">
                <div className="ticket-perforation left"></div>
                <div className="ticket-perforation right"></div>
                <div className="ticket-grid">
                  <div className="ticket-row">
                    <span></span><span>22</span><span>36</span><span></span><span>73</span>
                  </div>
                  <div className="ticket-row">
                    <span>9</span><span></span><span></span><span>61</span><span></span>
                  </div>
                  <div className="ticket-row">
                    <span></span><span>30</span><span>45</span><span></span><span>88</span>
                  </div>
                </div>
              </div>

              <div className="premium-ticket red-ticket">
                <div className="ticket-perforation left"></div>
                <div className="ticket-perforation right"></div>
                <div className="ticket-grid">
                  <div className="ticket-row">
                    <span>16</span><span></span><span>31</span><span>55</span><span></span>
                  </div>
                  <div className="ticket-row">
                    <span></span><span>23</span><span></span><span></span><span>71</span>
                  </div>
                  <div className="ticket-row">
                    <span>5</span><span></span><span>49</span><span>64</span><span>90</span>
                  </div>
                </div>
              </div>

              <div className="premium-ticket indigo-ticket">
                <div className="ticket-perforation left"></div>
                <div className="ticket-perforation right"></div>
                <div className="ticket-grid">
                  <div className="ticket-row">
                    <span></span><span>20</span><span>32</span><span></span><span>70</span>
                  </div>
                  <div className="ticket-row">
                    <span>13</span><span></span><span></span><span>57</span><span></span>
                  </div>
                  <div className="ticket-row">
                    <span></span><span>29</span><span>40</span><span></span><span>82</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Title */}
            <motion.h1 
              className="premium-3d-title"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: 0.3, 
                duration: 1.2,
                type: "spring",
                stiffness: 100,
                damping: 25
              }}
            >
              Tambola
            </motion.h1>

            {/* Pool Balls */}
            <div className="pool-balls-container">
              <motion.div 
                className="pool-ball ball-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="ball-number">75</div>
                <div className="ball-shine"></div>
              </motion.div>
              
              <motion.div 
                className="pool-ball ball-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <div className="ball-number">42</div>
                <div className="ball-shine"></div>
              </motion.div>
              
              <motion.div 
                className="pool-ball ball-3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <div className="ball-number">18</div>
                <div className="ball-shine"></div>
              </motion.div>
              
              <motion.div 
                className="pool-ball ball-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <div className="ball-number">63</div>
                <div className="ball-shine"></div>
              </motion.div>
              
              <motion.div 
                className="pool-ball ball-5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.6 }}
              >
                <div className="ball-number">9</div>
                <div className="ball-shine"></div>
              </motion.div>
              
              <motion.div 
                className="pool-ball ball-6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
              >
                <div className="ball-number">86</div>
                <div className="ball-shine"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Simplified layout - Join card directly below TAMBOLA */}
      <motion.div
        className="lp-join-card-simple"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
      >
        <div className="lp-card-header">
          <h2>Join the Game</h2>
          <span className={`lp-status-pill ${isConnected ? 'ok' : 'wait'}`}>
            {isConnected ? 'Online' : 'Connecting'}
          </span>
        </div>

        <div className="lp-form-row">
          <div className="form-group-compact">
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name"
              maxLength={18}
              className="name-input-compact"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="form-group-compact">
            <motion.button
              type="button"
              className="selected-avatar-compact"
              onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {selectedAvatar}
            </motion.button>
          </div>

          <motion.button
            className={`join-btn-compact ${(!playerName.trim() || !isConnected || joinInProgress) ? 'disabled' : ''}`}
            onClick={handleJoinGame}
            disabled={!playerName.trim() || !isConnected || joinInProgress}
            whileHover={isConnected && playerName.trim() && !joinInProgress ? { scale: 1.02 } : {}}
            whileTap={isConnected && playerName.trim() && !joinInProgress ? { scale: 0.98 } : {}}
          >
            {!isConnected ? 'Connecting...' : joinInProgress ? 'Joining...' : 'Enter Arena'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showAvatarSelector && (
            <AvatarSelector
              selectedAvatar={selectedAvatar}
              onSelectAvatar={(avatar) => {
                setSelectedAvatar(avatar);
                setShowAvatarSelector(false);
              }}
              onClose={() => setShowAvatarSelector(false)}
            />
          )}
        </AnimatePresence>

        <div className="connection-status-compact">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span>{isConnected ? 'Ready to play' : 'Connecting...'}</span>
        </div>
      </motion.div>

      {/* Tagline and badges moved to bottom */}
      <motion.div
        className="lp-bottom-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="tambola-tagline-compact">Premium Real-time Multiplayer Experience</p>
        <div className="lp-badges-row-compact">
          <Badge>⚡ Live Gaming</Badge>
          <Badge>🏆 Fair Play</Badge>
          <Badge>⚡ Instant Results</Badge>
        </div>
      </motion.div>

      <footer className="lp-footer">
        Crafted with ❤️ for the ultimate Tambola experience
      </footer>
    </div>
  );
};

export default LandingPage;