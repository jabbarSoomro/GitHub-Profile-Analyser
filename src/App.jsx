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

  // Search profile on page mount (default to 'gaearon')
  useEffect(() => {
    handleSearch('gaearon');
  }, []);

  const handleSearch = async (username) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch data in parallel
      const [profileRes, reposRes, eventsRes] = await Promise.all([
        fetchUserProfile(username),
        fetchUserRepos(username),
        fetchUserEvents(username)
      ]);

      // Process repository statistics
      const processedRepos = processRepoData(reposRes);
      
      // Process events for activity calendar / streak tracker
      const processedStreaks = processEventsData(eventsRes);

      setProfile(profileRes);
      setReposData(processedRepos);
      setStreakData(processedStreaks);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Search Input Bar */}
      <SearchBar onSearch={handleSearch} isLoading={loading} />

      {/* Error state */}
      {error && (
        <div className="error-banner animate-fade-in">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span className="error-message">{error}</span>
        </div>
      )}

      {/* Main Analysis Display */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        profile && !error && (
          <div className="dashboard-grid">
            
            {/* Row 1: Profile Main Details + Export Card */}
            <div className="dashboard-row row-flex">
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
            <div className="dashboard-row row-grid">
              <LanguageChart languages={reposData.languages} />
              <CommitStreak streakData={streakData} />
            </div>

            {/* Row 3: Contribution Grid */}
            <div className="dashboard-full-width">
              <ContributionGraph activityByDate={streakData ? streakData.activityByDate : {}} />
            </div>

            {/* Row 4: Repo Health Metrics */}
            <div className="dashboard-full-width">
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

      {/* Footer credits */}
      <footer className="app-footer">
        <p>
          Created by{' '}
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
          <a href="https://jabbarali.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</a>
          <span className="bullet">•</span>
          <a href="https://www.linkedin.com/in/jabbar-ali-soomro/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span className="bullet">•</span>
          <a href="https://github.com/jabbarSoomro" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
