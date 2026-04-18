import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StatsDisplay from './StatsDisplay';
import StatsTrends from './StatsTrends';
import SeasonHistory from './SeasonHistory';
import './PlayerDetail.css';

function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchPlayerDetail();
  }, [id]);

  const fetchPlayerDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/players/${id}`);
      setPlayer(response.data);
      setLoading(false);
      axios.patch(`${API_URL}/players/${id}`, {
        profileViews: (response.data?.profileViews || 0) + 1,
      }).catch(err => console.error('Error incrementing views:', err));
    } catch (error) {
      console.error('Error fetching player:', error);
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return <div className="loading">Loading player details...</div>;
  }

  if (!player) {
    return (
      <div className="player-detail">
        <div className="container">
          <Link to="/players" className="back-button">
            ← Back
          </Link>
          <div className="error">Player not found</div>
        </div>
      </div>
    );
  }

  const positionsText = Array.isArray(player.position)
    ? player.position.join(', ')
    : player.position;

  return (
    <div className="player-detail">
      <div className="container">
        <Link to="/players" className="back-button">
          ← Back
        </Link>

        <div className="player-header-section">
          <div className="player-left">
            <div className="player-image-large">
              {player.imageUrl ? (
                <img src={player.imageUrl} alt={player.name} />
              ) : (
                <div className="placeholder-large">👤</div>
              )}
            </div>
            <div className="jersey-number">#{player.number}</div>
          </div>

          <div className="player-info-section">
            <p className="team-label">{player.team}</p>
            <h1 className="player-name">{player.name}</h1>

            <div className="positions-box">
              {positionsText}
            </div>

            <div className="player-details-grid">
              <div className="detail-item">
                <span className="detail-label">HT</span>
                <span className="detail-value">{player.height}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">WT</span>
                <span className="detail-value">{player.weight} lbs</span>
              </div>
              {player.age && (
                <div className="detail-item">
                  <span className="detail-label">AGE</span>
                  <span className="detail-value">{player.age}</span>
                </div>
              )}
              {player.dateOfBirth && (
                <div className="detail-item">
                  <span className="detail-label">DOB</span>
                  <span className="detail-value">{player.dateOfBirth}</span>
                </div>
              )}
            </div>

            {player.hometown && (
              <div className="hometown-section">
                <p className="hometown-label">HOMETOWN</p>
                <p className="hometown-value">{player.hometown}</p>
              </div>
            )}

            <button
              className={`favorite-button ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              ♡ FAVORITE
            </button>
          </div>
        </div>

        {player.profileViews > 0 && (
          <div className="profile-views">
            👁 {player.profileViews} PROFILE VIEWS
          </div>
        )}

        <div className="stats-section-wrapper">
          <div className="stats-left">
            <StatsDisplay stats={player.stats} />
          </div>
          <div className="stats-right">
            <StatsTrends trends={player.seasonTrends} />
          </div>
        </div>

        <SeasonHistory seasonHistory={player.seasonHistory} />
      </div>
    </div>
  );
}

export default PlayerDetail;
