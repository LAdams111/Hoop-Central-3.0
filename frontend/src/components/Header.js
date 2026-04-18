import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/players?q=${encodeURIComponent(q)}` : '/players');
  };

  const navClass = ({ isActive }) =>
    `nav-link${isActive ? ' active' : ''}`;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon" aria-hidden>
            🏀
          </span>
          <span className="logo-wordmark">
            <span className="logo-hoop">HOOP</span>
            <span className="logo-central">CENTRAL</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/leagues" className={navClass}>
            Leagues
          </NavLink>
          <NavLink to="/prospects" className={navClass}>
            Prospects
          </NavLink>
          <NavLink to="/classes" className={navClass}>
            Birth Year
          </NavLink>
          <NavLink to="/players" className={navClass}>
            Directory
          </NavLink>
        </nav>
        <form className="header-search" onSubmit={onSearchSubmit} role="search">
          <input
            type="search"
            name="q"
            placeholder="Search players…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search players"
          />
          <button type="submit" className="header-search-submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
