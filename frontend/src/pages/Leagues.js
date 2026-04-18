import React from 'react';
import LeagueCard from '../components/LeagueCard';
import {
  domesticLeagues,
  internationalLeagues,
} from '../data/leaguesCatalog';
import './Leagues.css';

function Leagues() {
  return (
    <div className="leagues-page">
      <div className="leagues-container">
        <header className="leagues-hero">
          <h1>Leagues</h1>
          <p className="leagues-sub">
            Browse leagues and explore team rosters.
          </p>
        </header>

        <div className="leagues-stack">
          {domesticLeagues.map((league) => (
            <LeagueCard key={league.slug} league={league} />
          ))}
        </div>

        <header className="leagues-section-head">
          <h2>International</h2>
          <p className="leagues-sub">
            Professional basketball leagues from around the globe.
          </p>
        </header>

        <div className="leagues-stack">
          {internationalLeagues.map((league) => (
            <LeagueCard key={league.slug} league={league} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leagues;
