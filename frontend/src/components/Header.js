import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏀</span>
          <span className="logo-text">HOOPCENTRAL</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link active">
            HOME
          </Link>
          <Link to="/leagues" className="nav-link">
            LEAGUES
          </Link>
          <a href="#prospects" className="nav-link">
            PROSPECTS
          </a>
          <a href="#birthyear" className="nav-link">
            BIRTH YEAR
          </a>
          <a href="#directory" className="nav-link">
            DIRECTORY
          </a>
        </nav>
        <button className="search-button">🔍</button>
      </div>
    </header>
  );
}

export default Header;
