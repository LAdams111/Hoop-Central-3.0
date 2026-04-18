import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './LeagueTeams.css';

function LeagueTeams() {
  const { leagueId } = useParams();
  const [league, setLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLeagueAndTeams();
  }, [leagueId]);

  const fetchLeagueAndTeams = async () => {
    try {
      const leagueRes = await axios.get(`${API_URL}/leagues/${leagueId}`);
      setLeague(leagueRes.data);

      const teamsRes = await axios.get(`${API_URL}/teams?league=${leagueId}`);
      setTeams(teamsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="league-teams-page">
      <div className="container">
        <Link to="/leagues" className="back-button">
          ← Back
        </Link>

        <div className="league-header">
          {league?.logoUrl && (
            <img src={league.logoUrl} alt={league?.name} className="league-logo" />
          )}
          <div className="league-title">
            <p className="league-type">{league?.type.toUpperCase()}</p>
            <h1>{league?.name}</h1>
            <p className="league-description">{league?.description}</p>
          </div>
        </div>

        <div className="teams-section">
          <div className="section-header">
            <h2>TEAMS</h2>
            <span className="team-count">{filteredTeams.length} of {teams.length}</span>
          </div>

          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="teams-grid">
            {filteredTeams.map((team) => {
              const currentSeason = team.seasons?.find(
                (s) => s.year === team.currentSeason
              );
              return (
                <Link
                  key={team._id}
                  to={`/teams/${team._id}`}
                  className="team-card"
                >
                  <div className="team-logo">
                    {team.logoUrl ? (
                      <img src={team.logoUrl} alt={team.name} />
                    ) : (
                      <div className="placeholder">🏀</div>
                    )}
                  </div>
                  <div className="team-info">
                    <p className="league-label">NBA</p>
                    <h3>{team.name}</h3>
                    <p className="season">{team.currentSeason}</p>
                    {currentSeason && (
                      <p className="record">
                        {currentSeason.wins}-{currentSeason.losses}
                      </p>
                    )}
                  </div>
                  <div className="team-arrow">→</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeagueTeams;
