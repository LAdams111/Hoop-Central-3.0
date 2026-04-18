import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './StatsTrends.css';

function StatsTrends({ trends }) {
  if (!trends || (!trends.points && !trends.assists)) {
    return null;
  }

  const pointsData = trends.points?.map((value, index) => ({
    game: index + 1,
    points: value,
  })) || [];

  const assistsData = trends.assists?.map((value, index) => ({
    game: index + 1,
    assists: value,
  })) || [];

  return (
    <div className="stats-trends">
      <div className="trend-section">
        <div className="trend-header">
          <span className="trend-label">POINTS</span>
          <span className="trend-season">● 2025-26 · Per Game</span>
        </div>
        {pointsData.length > 0 && (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={pointsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="game" stroke="#999" style={{ fontSize: '12px' }} />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="points"
                stroke="#ff8c00"
                dot={false}
                strokeWidth={2}
                fill="#ff8c0020"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="trend-section">
        <div className="trend-header">
          <span className="trend-label">ASSISTS</span>
          <span className="trend-season">● 2025-26 · Per Game</span>
        </div>
        {assistsData.length > 0 && (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={assistsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="game" stroke="#999" style={{ fontSize: '12px' }} />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="assists"
                stroke="#4a9eff"
                dot={false}
                strokeWidth={2}
                fill="#4a9eff20"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default StatsTrends;
