import React from 'react';
import './SeasonHistory.css';

function SeasonHistory({ seasonHistory }) {
  if (!seasonHistory || seasonHistory.length === 0) {
    return null;
  }

  return (
    <div className="season-history">
      <h3>SEASON HISTORY</h3>
      <div className="table-wrapper">
        <table className="season-table">
          <thead>
            <tr>
              <th>SEASON</th>
              <th>LEAGUE</th>
              <th>TEAM</th>
              <th className="text-center">GP</th>
              <th className="text-right orange-text">PTS</th>
              <th className="text-right">REB</th>
              <th className="text-right cyan-text">AST</th>
              <th className="text-right">BLK</th>
              <th className="text-right">STL</th>
              <th className="text-right cyan-text">FG%</th>
            </tr>
          </thead>
          <tbody>
            {seasonHistory.map((season, index) => (
              <tr key={index}>
                <td className="season-col">{season.season}</td>
                <td>{season.league}</td>
                <td className="team-col orange-text">{season.team}</td>
                <td className="text-center">{season.gamesPlayed}</td>
                <td className="text-right orange-text bold">
                  {season.points?.toFixed(1)}
                </td>
                <td className="text-right">{season.rebounds?.toFixed(1)}</td>
                <td className="text-right cyan-text bold">
                  {season.assists?.toFixed(1)}
                </td>
                <td className="text-right">{season.blocks?.toFixed(1)}</td>
                <td className="text-right">{season.steals?.toFixed(1)}</td>
                <td className="text-right cyan-text">
                  {season.fieldGoalPercentage?.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SeasonHistory;
