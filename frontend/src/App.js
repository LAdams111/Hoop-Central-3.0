import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import PlayerList from './components/PlayerList';
import PlayerDetail from './components/PlayerDetail';
import Header from './components/Header';
import Home from './pages/Home';
import Leagues from './pages/Leagues';
import LeagueTeams from './pages/LeagueTeams';
import TeamRoster from './pages/TeamRoster';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/players`);
      setPlayers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching players:', error);
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/players"
            element={
              <PlayerList
                players={players}
                loading={loading}
                variant="directory"
              />
            }
          />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route
            path="/prospects"
            element={
              <PlayerList
                players={players}
                loading={loading}
                variant="prospects"
              />
            }
          />
          <Route
            path="/classes"
            element={
              <PlayerList
                players={players}
                loading={loading}
                variant="birthYear"
              />
            }
          />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/leagues/:leagueSlug" element={<LeagueTeams />} />
          <Route path="/teams/:teamId" element={<TeamRoster />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
