import React, { useState, useEffect } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, isLoading }) {
  const [username, setUsername] = useState('');
  const [recents, setRecents] = useState([]);

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
    
    // Support pasting complete Github URLs
    if (cleaned.includes('github.com/')) {
      const parts = cleaned.split('github.com/');
      if (parts.length > 1) {
        cleaned = parts[1];
      }
    }
    
    // Strip leading @ if entered as @username
    if (cleaned.startsWith('@')) {
      cleaned = cleaned.substring(1);
    }
    
    // Clean up trailing paths, query variables, and hashes
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

    // Update input field to show cleaned username to the user
    setUsername(cleanUsername);
    onSearch(cleanUsername);
    saveRecent(cleanUsername);
  };

  const saveRecent = (user) => {
    const filtered = recents.filter(r => r.toLowerCase() !== user.toLowerCase());
    const updated = [user, ...filtered].slice(0, 5); // Keep top 5
    setRecents(updated);
    localStorage.setItem('gh_analyser_recents', JSON.stringify(updated));
  };

  const handleChipClick = (user) => {
    setUsername(user);
    onSearch(user);
  };

  const clearRecents = () => {
    setRecents([]);
    localStorage.removeItem('gh_analyser_recents');
  };

  return (
    <div className="search-section animate-fade-in">
      <h1 className="main-title">
        GitHub Profile <span className="gradient-text">Analyser</span>
      </h1>
      <p className="subtitle">
        Enter any username to get streaks, health scores, language charts, and a shareable dev card.
      </p>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub username (e.g. torvalds, gaearon)..."
            className="search-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="search-btn"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Analyse</span>
              </>
            )}
          </button>
        </div>
      </form>

      {recents.length > 0 && (
        <div className="recent-searches">
          <span className="recent-title">Recent searches:</span>
          <div className="chips-container">
            {recents.map((user, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(user)}
                className="recent-chip"
                disabled={isLoading}
              >
                {user}
              </button>
            ))}
            <button onClick={clearRecents} className="clear-recents-btn" title="Clear history">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
