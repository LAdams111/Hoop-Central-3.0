import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="home-inner">
        <p className="home-kicker">Hoop Central</p>
        <h1>Basketball profiles &amp; rosters</h1>
        <p className="home-copy">
          Pick a league to browse teams, or open the full player directory. Data
          loads from your API—wire your scraper to the same database when you
          are ready.
        </p>
        <div className="home-actions">
          <Link to="/leagues" className="home-btn home-btn-primary">
            Leagues
          </Link>
          <Link to="/players" className="home-btn home-btn-outline">
            Directory
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
