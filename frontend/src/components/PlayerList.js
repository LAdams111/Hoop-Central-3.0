import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './PlayerList.css';

function positionDisplay(player) {
  const pos = player.position;
  if (Array.isArray(pos)) {
    const parts = pos.filter(Boolean);
    return parts.length ? parts.join(', ') : '—';
  }
  return pos || '—';
}

function collectPositions(players) {
  const set = new Set();
  players.forEach((p) => {
    const pos = p.position;
    if (Array.isArray(pos)) pos.forEach((x) => x && set.add(x));
    else if (pos) set.add(pos);
  });
  return ['All', ...Array.from(set).sort()];
}

function matchesPosition(player, filter) {
  if (filter === 'All') return true;
  const pos = player.position;
  if (Array.isArray(pos)) return pos.includes(filter);
  return pos === filter;
}

function isProspect(player) {
  if (player.draftYear) return true;
  if (player.age != null && player.age <= 22) return true;
  return false;
}

function birthYearFromPlayer(player) {
  if (!player.dateOfBirth) return null;
  const raw = String(player.dateOfBirth);
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d.getFullYear();
  const m = raw.match(/\b(19|20)\d{2}\b/);
  return m ? parseInt(m[0], 10) : null;
}

const PAGE_COPY = {
  directory: {
    kicker: 'DIRECTORY',
    title: 'ALL PLAYERS',
    subtitle:
      'A–Z listing of everyone in the database. Switch to cards when you want a more visual browse.',
  },
  prospects: {
    kicker: 'PROSPECTS',
    title: 'DRAFT & YOUTH TRACK',
    subtitle:
      'Players age 22 and under or with a draft year on file. Filters below still apply.',
  },
  birthYear: {
    kicker: 'BIRTH YEAR',
    title: 'GROUPED BY YEAR',
    subtitle:
      'Rosters grouped by date of birth when available. Unknown birth years appear last.',
  },
};

function PlayerList({ players, loading, variant = 'directory' }) {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q != null) setSearchTerm(q);
  }, [searchParams]);

  const positions = useMemo(() => collectPositions(players), [players]);

  const filteredRaw = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return players.filter((player) => {
      const blob = [
        player.name,
        player.team,
        player.number != null ? String(player.number) : '',
        positionDisplay(player),
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = !term || blob.includes(term);
      const matchesPos = matchesPosition(player, positionFilter);
      return matchesSearch && matchesPos;
    });
  }, [players, searchTerm, positionFilter]);

  const visiblePlayers = useMemo(() => {
    if (variant === 'prospects') {
      return filteredRaw.filter(isProspect);
    }
    return filteredRaw;
  }, [filteredRaw, variant]);

  const sortedPlayers = useMemo(
    () => [...visiblePlayers].sort((a, b) => a.name.localeCompare(b.name)),
    [visiblePlayers]
  );

  const birthYearBuckets = useMemo(() => {
    if (variant !== 'birthYear') return null;
    const map = new Map();
    sortedPlayers.forEach((p) => {
      const y = birthYearFromPlayer(p);
      const key = y == null ? '__unknown' : String(y);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    const known = [...map.keys()]
      .filter((k) => k !== '__unknown')
      .sort((a, b) => Number(b) - Number(a));
    const order = [...known];
    if (map.has('__unknown')) order.push('__unknown');
    return order.map((key) => ({
      label: key === '__unknown' ? 'Year unknown' : key,
      players: map.get(key),
    }));
  }, [sortedPlayers, variant]);

  if (loading) {
    return <div className="hc-loading">Loading directory…</div>;
  }

  const copy = PAGE_COPY[variant] || PAGE_COPY.directory;
  const showViewToggle = variant !== 'birthYear';
  const useTable = variant === 'birthYear' || viewMode === 'table';

  const renderTableRows = (list) =>
    list.map((player) => (
      <tr key={player._id}>
        <td className="col-photo">
          <Link to={`/players/${player._id}`} className="hc-thumb-link">
            <span className="hc-thumb">
              {player.imageUrl ? (
                <img src={player.imageUrl} alt="" />
              ) : (
                <span className="hc-thumb-ph" aria-hidden>
                  ···
                </span>
              )}
            </span>
          </Link>
        </td>
        <td className="text-num mono">{player.number}</td>
        <td>
          <Link to={`/players/${player._id}`} className="hc-name-link">
            {player.name}
          </Link>
        </td>
        <td className="muted upper">{positionDisplay(player)}</td>
        <td className="mono">{player.height}</td>
        <td className="mono">
          {player.weight != null ? `${player.weight} lb` : '—'}
        </td>
        <td>{player.team}</td>
        <td className="text-num mono">
          {player.age != null ? player.age : '—'}
        </td>
      </tr>
    ));

  const renderTable = (list) => (
    <div className="hc-table-wrap">
      <table className="hc-directory-table">
        <thead>
          <tr>
            <th className="col-photo" scope="col" />
            <th scope="col">#</th>
            <th scope="col">Player</th>
            <th scope="col">Pos</th>
            <th scope="col">HT</th>
            <th scope="col">WT</th>
            <th scope="col">Team</th>
            <th className="text-num" scope="col">
              Age
            </th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            renderTableRows(list)
          ) : (
            <tr>
              <td colSpan={8} className="hc-empty-cell">
                No players match these filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderCards = () => (
    <div className="players-grid">
      {sortedPlayers.length > 0 ? (
        sortedPlayers.map((player) => (
          <Link
            key={player._id}
            to={`/players/${player._id}`}
            className="player-card"
          >
            <div className="player-image">
              {player.imageUrl ? (
                <img src={player.imageUrl} alt={player.name} />
              ) : (
                <div className="placeholder" aria-hidden>
                  📷
                </div>
              )}
            </div>
            <div className="player-info">
              <h3>{player.name}</h3>
              <p className="position">{positionDisplay(player)}</p>
              <p className="team">{player.team}</p>
              <p className="number">#{player.number}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="no-results">No players found</p>
      )}
    </div>
  );

  return (
    <main className="player-directory">
      <div className="container">
        <header className="hc-page-hero">
          <p className="hc-page-kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p className="hc-page-sub">{copy.subtitle}</p>
        </header>

        <div className="hc-toolbar">
          <div className="hc-toolbar-left">
            <input
              type="text"
              placeholder="Filter list…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Filter players"
            />
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="position-filter"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
          <div className="hc-toolbar-right">
            <span className="hc-count">
              {sortedPlayers.length}{' '}
              {sortedPlayers.length === 1 ? 'player' : 'players'}
            </span>
            {showViewToggle && (
              <div className="hc-seg" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={viewMode === 'table' ? 'active' : ''}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </button>
                <button
                  type="button"
                  className={viewMode === 'cards' ? 'active' : ''}
                  onClick={() => setViewMode('cards')}
                >
                  Cards
                </button>
              </div>
            )}
          </div>
        </div>

        {variant === 'birthYear' ? (
          birthYearBuckets && birthYearBuckets.length > 0 ? (
            <div className="hc-birth-sections">
              {birthYearBuckets.map((bucket) => (
                <section key={bucket.label} className="hc-birth-block">
                  <h2 className="hc-birth-heading">{bucket.label}</h2>
                  {renderTable(bucket.players)}
                </section>
              ))}
            </div>
          ) : (
            <p className="no-results">No players found</p>
          )
        ) : useTable ? (
          renderTable(sortedPlayers)
        ) : (
          renderCards()
        )}
      </div>
    </main>
  );
}

export default PlayerList;
