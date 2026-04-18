import React from 'react';
import { Link } from 'react-router-dom';
import './LeagueCard.css';

const flagSrc = (code) =>
  `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;

function LeagueCard({ league }) {
  return (
    <Link
      to={`/leagues/${league.slug}`}
      className="league-card-link"
      data-testid={`link-league-${league.slug.toLowerCase()}`}
    >
      <article className="league-card-shell">
        <div className="league-card-inner">
          <div className="league-card-logo">
            {league.logoUrl ? (
              <img src={league.logoUrl} alt={league.name} />
            ) : (
              <div className="league-card-logo-fallback" aria-hidden>
                {league.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="league-card-body">
            <div className="league-card-tier">{league.tier}</div>
            <div className="league-card-title-row">
              <h2 className="league-card-name">{league.name}</h2>
              <span className="league-card-chevron" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <p className="league-card-desc">{league.description}</p>
          </div>
          <div className="league-card-region">
            <div className="league-card-region-label">Region</div>
            <div className="league-card-region-flags">
              {league.regions.map((code) => (
                <img
                  key={code}
                  src={flagSrc(code)}
                  alt={code}
                  title={code}
                  className="league-card-flag"
                />
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default LeagueCard;
