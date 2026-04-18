import React from 'react';
import './StatsDisplay.css';

function StatsDisplay({ stats }) {
  if (!stats) {
    return <p>No stats available</p>;
  }

  const statBoxes = [
    {
      icon: '●',
      label: 'PPG',
      value: stats.pointsPerGame?.toFixed(1) || 'N/A',
      color: 'orange',
    },
    {
      icon: '↗',
      label: 'APG',
      value: stats.assistsPerGame?.toFixed(1) || 'N/A',
      color: 'blue',
    },
    {
      icon: '🏆',
      label: 'RPG',
      value: stats.reboundsPerGame?.toFixed(1) || 'N/A',
      color: 'gold',
    },
  ];

  return (
    <div className="current-season-stats">
      <h3>CURRENT SEASON (2025-26)</h3>
      <div className="stats-boxes">
        {statBoxes.map((box, index) => (
          <div key={index} className={`stat-box ${box.color}`}>
            <span className="stat-icon">{box.icon}</span>
            <div className="stat-content">
              <div className="stat-value">{box.value}</div>
              <div className="stat-label">{box.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsDisplay;
