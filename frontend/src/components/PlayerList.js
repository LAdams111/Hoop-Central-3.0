import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PlayerList.css';

function PlayerList({ players, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPosition =
      positionFilter === 'All' || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const positions = ['All', ...new Set(players.map((p) => p.position))];

  if (loading) {
    return <div className="loading">Loading players...</div>;
  }

  return (
    <div className="container">
      <div className="player-list-header">
        <h2>Basketball Players</h2>
        <p>Browse and explore player profiles</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="position-filter"
        >
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>

      <div className="players-grid">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <Link
              key={player._id}
              to={`/player/${player._id}`}
              className="player-card"
            >
              <div className="player-image">
                {player.imageUrl ? (
                  <img src={player.imageUrl} alt={player.name} />
                ) : (
                  <div className="placeholder">📷</div>
                )}
              </div>
              <div className="player-info">
                <h3>{player.name}</h3>
                <p className="position">{player.position}</p>
                <p className="team">{player.team}</p>
                <p className="number">#{player.number}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-results">No players found</p>
        )}
      </div>
    </div>
  );
}

export default PlayerList;
