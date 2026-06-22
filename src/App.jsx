import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ProfileHeader from './components/ProfileHeader';
import LanguageChart from './components/LanguageChart';
import ContributionGraph from './components/ContributionGraph';
import CommitStreak from './components/CommitStreak';
import RepoHealthScores from './components/RepoHealthScores';
import DeveloperCard from './components/DeveloperCard';
import LoadingSkeleton from './components/LoadingSkeleton';

import {
  fetchUserProfile,
  fetchUserRepos,
  fetchUserEvents,
  processRepoData,
  processEventsData
} from './api/github';

import './App.css';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [reposData, setReposData] = useState({ languages: [], scoredRepos: [] });
  const [streakData, setStreakData] = useState(null);
  const [searchedUsername, setSearchedUsername] = useState('');

  const handleSearch = async (username) => {
    setLoading(true);
    setError('');
    setSearchedUsername(username);
    
    try {
      const [profileRes, reposRes, eventsRes] = await Promise.all([
        fetchUserProfile(username),
        fetchUserRepos(username),
        fetchUserEvents(username)
      ]);

      const processedRepos = processRepoData(reposRes);
      const processedStreaks = processEventsData(eventsRes);

      setProfile(profileRes);
      setReposData(processedRepos);
      setStreakData(processedStreaks);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Animated background orbs */}
      <div className="bg-particles">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      <div className="app-container">
        {/* Search Input Bar */}
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {/* Error state */}
        {error && (
          <div className="error-banner animate-fade-in">
            <div className="error-icon-wrapper">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="error-content">
              <span className="error-title">Analysis Failed</span>
              <span className="error-message">{error}</span>
              {searchedUsername && (
                <button className="error-retry-btn" onClick={() => handleSearch(searchedUsername)}>
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Analysis Display */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          profile && !error && (
            <div className="dashboard-grid">
              
              {/* Row 1: Profile Header + Developer Card */}
              <div className="dashboard-row row-flex animate-fade-in stagger-1">
                <div className="col-header">
                  <ProfileHeader profile={profile} />
                </div>
                <div className="col-card">
                  <DeveloperCard
                    profile={profile}
                    languages={reposData.languages}
                    streakData={streakData}
                  />
                </div>
              </div>

              {/* Row 2: Languages Donut + Streak stats */}
              <div className="dashboard-row row-grid animate-fade-in stagger-2">
                <LanguageChart languages={reposData.languages} />
                <CommitStreak streakData={streakData} />
              </div>

              {/* Row 3: Contribution Grid */}
              <div className="dashboard-full-width animate-fade-in stagger-3">
                <ContributionGraph activityByDate={streakData ? streakData.activityByDate : {}} />
              </div>

              {/* Row 4: Repo Health Metrics */}
              <div className="dashboard-full-width animate-fade-in stagger-4">
                <RepoHealthScores scoredRepos={reposData.scoredRepos} />
              </div>

            </div>
          )
        )}

        {/* SVG Fire gradient definition for streaks */}
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
          <defs>
            <linearGradient id="fire-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9500" />
              <stop offset="100%" stopColor="#ff5e3a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Footer */}
        <footer className="app-footer animate-fade-in stagger-5">
          <div className="footer-inner">
            <div className="footer-brand">
              <svg className="footer-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>GitHub Profile Analyser</span>
            </div>
            <p className="footer-credit">
              Built by{' '}
              <a
                href="https://github.com/jabbarSoomro"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-author-link"
              >
                Jabbar Ali Soomro
              </a>
            </p>
            <div className="footer-links">
              <a href="https://jabbarali.vercel.app/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Portfolio
              </a>
              <a href="https://www.linkedin.com/in/jabbar-ali-soomro/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
              <a href="https://github.com/jabbarSoomro" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                GitHub
              </a>
            </div>
            <p className="footer-copy">© 2025 All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
