import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './TeamRoster.css';

function TeamRoster() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('2025-26');
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`${API_URL}/teams/${teamId}`);
      setTeam(response.data);
      setSelectedSeason(response.data.currentSeason || '2025-26');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading roster...</div>;
  }

  if (!team) {
    return (
      <div className="container">
        <Link to="/leagues" className="back-button">
          ← Back
        </Link>
        <div className="error">Team not found</div>
      </div>
    );
  }

  const currentSeasonData = team.seasons?.find((s) => s.year === selectedSeason);
  const roster = currentSeasonData?.roster || [];

  return (
    <div className="team-roster-page">
      <div className="container">
        <Link to="/" className="back-button">
          ← Back
        </Link>

        <div className="team-header">
          <div className="team-logo-section">
            {team.logoUrl && (
              <img src={team.logoUrl} alt={team.name} className="team-logo-large" />
            )}
          </div>
          <div className="team-info-section">
            <h1>{team.name}</h1>
            <p className="team-subtitle">TEAM ROSTER</p>
            {currentSeasonData && (
              <div className="team-record">
                <span className="wins-losses">
                  {currentSeasonData.wins} - {currentSeasonData.losses}
                </span>
                <span className="record-label">W - L</span>
              </div>
            )}
          </div>
          <div className="season-selector">
            <label>SELECT SEASON</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
            >
              {team.seasons?.map((season) => (
                <option key={season.year} value={season.year}>
                  {season.year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="roster-section">
          <div className="roster-header">
            <h2>{selectedSeason} SEASON ROSTER</h2>
            <span className="active-badge">{roster.length} ACTIVE</span>
            {currentSeasonData && (
              <span className="record-display">
                {currentSeasonData.wins} - {currentSeasonData.losses} W - L
              </span>
            )}
          </div>

          <div className="players-grid">
            {roster.length > 0 ? (
              roster.map((player) => (
                <Link
                  key={player._id}
                  to={`/player/${player._id}`}
                  className="player-roster-card"
                >
                  <div className="player-avatar">
                    {player.imageUrl ? (
                      <img src={player.imageUrl} alt={player.name} />
                    ) : (
                      <div className="placeholder">👤</div>
                    )}
                  </div>
                  <h3>{player.name}</h3>
                  <p className="jersey-number">#{player.number}</p>
                  <span className="view-profile">VIEW PROFILE</span>
                </Link>
              ))
            ) : (
              <p className="no-roster">No roster data available for this season</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamRoster;
