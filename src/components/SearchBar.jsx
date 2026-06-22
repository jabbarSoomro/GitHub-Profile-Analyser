import React, { useState, useEffect } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, isLoading }) {
  const [username, setUsername] = useState('');
  const [recents, setRecents] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('gh_analyser_recents');
    if (stored) {
      try {
        setRecents(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const extractUsername = (input) => {
    let cleaned = input.trim();
    if (cleaned.includes('github.com/')) {
      const parts = cleaned.split('github.com/');
      if (parts.length > 1) cleaned = parts[1];
    }
    if (cleaned.startsWith('@')) cleaned = cleaned.substring(1);
    cleaned = cleaned.replace(/^\/+|\/+$/g, '');
    cleaned = cleaned.split('/')[0];
    cleaned = cleaned.split('?')[0];
    cleaned = cleaned.split('#')[0];
    return cleaned;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUsername = extractUsername(username);
    if (!cleanUsername) return;
    setUsername(cleanUsername);
    onSearch(cleanUsername);
    saveRecent(cleanUsername);
  };

  const saveRecent = (user) => {
    const filtered = recents.filter(r => r.toLowerCase() !== user.toLowerCase());
    const updated = [user, ...filtered].slice(0, 5);
    setRecents(updated);
    localStorage.setItem('gh_analyser_recents', JSON.stringify(updated));
  };

  const handleChipClick = (user) => {
    setUsername(user);
    onSearch(user);
    saveRecent(user);
  };

  const clearRecents = () => {
    setRecents([]);
    localStorage.removeItem('gh_analyser_recents');
  };

  return (
    <div className="search-section animate-fade-in">
      {/* Floating badge above the title */}
      <div className="hero-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
        <span>Developer Analytics Platform</span>
      </div>

      <h1 className="main-title">
        GitHub Profile{' '}
        <span className="gradient-text">Analyser</span>
      </h1>
      <p className="subtitle">
        Paste any GitHub username or profile URL to get beautiful visualizations — language breakdowns,
        commit streaks, repo health scores, and a shareable developer card.
      </p>

      <form onSubmit={handleSubmit} className="search-form">
        <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
          <div className="search-input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter username or paste profile URL..."
            className="search-input"
            disabled={isLoading}
            id="github-username-input"
          />
          <button
            type="submit"
            className="search-btn"
            disabled={isLoading || !username.trim()}
            id="analyse-button"
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <span>Analyse</span>
            )}
          </button>
        </div>
      </form>

      {/* Feature pills below search */}
      <div className="feature-pills">
        <span className="feature-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          Commit Streaks
        </span>
        <span className="feature-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Repo Health
        </span>
        <span className="feature-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          Language Charts
        </span>
        <span className="feature-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Dev Card PNG
        </span>
      </div>

      {recents.length > 0 && (
        <div className="recent-searches">
          <span className="recent-title">Recent:</span>
          <div className="chips-container">
            {recents.map((user, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(user)}
                className="recent-chip"
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chip-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {user}
              </button>
            ))}
            <button onClick={clearRecents} className="clear-recents-btn" title="Clear history">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
