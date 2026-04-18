import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getLeagueBySlug } from '../data/leaguesCatalog';
import './LeagueTeams.css';

const flagSrc = (code) =>
  `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;

function LeagueTeams() {
  const { leagueSlug } = useParams();
  const catalog = getLeagueBySlug(leagueSlug);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!catalog) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const teamsRes = await axios.get(
          `${API_URL}/teams?leagueSlug=${encodeURIComponent(leagueSlug)}`
        );
        if (!cancelled) setTeams(teamsRes.data || []);
      } catch (error) {
        console.error('Error fetching teams:', error);
        if (!cancelled) setTeams([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [leagueSlug, catalog]);

  if (!catalog) {
    return (
      <div className="league-teams-page">
        <div className="leagues-container">
          <Link to="/leagues" className="lt-back">
            ← Leagues
          </Link>
          <p className="lt-empty">League not found.</p>
        </div>
      </div>
    );
  }

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="hc-loading">Loading teams…</div>;
  }

  return (
    <div className="league-teams-page">
      <div className="leagues-container">
        <Link to="/leagues" className="lt-back">
          ← Leagues
        </Link>

        <header className="lt-hero">
          <div className="lt-hero-logo">
            {catalog.logoUrl ? (
              <img src={catalog.logoUrl} alt="" />
            ) : (
              <div className="lt-hero-logo-fallback">{catalog.name.charAt(0)}</div>
            )}
          </div>
          <div className="lt-hero-text">
            <p className="lt-tier">{catalog.tier}</p>
            <h1>{catalog.name}</h1>
            <p className="lt-desc">{catalog.description}</p>
            <div className="lt-region-block">
              <span className="lt-region-label">Region</span>
              <div className="lt-region-flags">
                {catalog.regions.map((code) => (
                  <img
                    key={code}
                    src={flagSrc(code)}
                    alt={code}
                    title={code}
                    className="lt-flag"
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="lt-teams-panel">
          <div className="lt-teams-head">
            <h2>Teams</h2>
            <span className="lt-team-count">
              {filteredTeams.length} of {teams.length}
            </span>
          </div>

          <input
            type="search"
            className="lt-search"
            placeholder="Search teams…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search teams"
          />

          {filteredTeams.length === 0 ? (
            <p className="lt-empty">
              {teams.length === 0
                ? 'No teams in the database for this league yet. Add leagues with matching slugs and teams via your API or scraper.'
                : 'No teams match your search.'}
            </p>
          ) : (
            <div className="lt-teams-grid">
              {filteredTeams.map((team) => {
                const currentSeason = team.seasons?.find(
                  (s) => s.year === team.currentSeason
                );
                return (
                  <Link
                    key={team._id}
                    to={`/teams/${team._id}`}
                    className="lt-team-card"
                  >
                    <div className="lt-team-logo">
                      {team.logoUrl ? (
                        <img src={team.logoUrl} alt="" />
                      ) : (
                        <span className="lt-team-ph" aria-hidden>
                          🏀
                        </span>
                      )}
                    </div>
                    <div className="lt-team-meta">
                      <p className="lt-team-league">{catalog.name}</p>
                      <h3>{team.name}</h3>
                      <p className="lt-team-season">{team.currentSeason}</p>
                      {currentSeason && (
                        <p className="lt-team-record">
                          {currentSeason.wins}-{currentSeason.losses}
                        </p>
                      )}
                    </div>
                    <span className="lt-team-arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default LeagueTeams;
