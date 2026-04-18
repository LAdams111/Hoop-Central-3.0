import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Leagues.css';

function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const response = await axios.get(`${API_URL}/leagues`);
      setLeagues(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leagues:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading leagues...</div>;
  }

  return (
    <div className="leagues-page">
      <div className="container">
        <h1>LEAGUES</h1>
        <div className="leagues-grid">
          {leagues.map((league) => (
            <Link
              key={league._id}
              to={`/leagues/${league._id}`}
              className="league-card"
            >
              <div className="league-logo">
                {league.logoUrl ? (
                  <img src={league.logoUrl} alt={league.name} />
                ) : (
                  <div className="placeholder">🏀</div>
                )}
              </div>
              <div className="league-info">
                <p className="league-type">{league.type.toUpperCase()}</p>
                <h2>{league.name}</h2>
                <p className="league-description">{league.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leagues;
