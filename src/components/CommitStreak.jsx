import React from 'react';
import './CommitStreak.css';

export default function CommitStreak({ streakData }) {
  if (!streakData) return null;

  const { currentStreak, longestStreak, totalContributions, activeDaysCount } = streakData;

  return (
    <div className="glass-panel streak-panel animate-fade-in">
      <h3 className="panel-title">Commit Streak Tracker</h3>

      <div className="streak-layout">
        {/* Current Streak Indicator */}
        <div className="streak-main">
          <div className="streak-fire-wrapper">
            <svg
              className={`streak-fire-icon ${currentStreak > 0 ? 'active-flame' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
            <div className="flame-glow"></div>
          </div>
          <div className="streak-current-text">
            <span className="streak-current-val">{currentStreak}</span>
            <span className="streak-current-lbl">Day Current Streak</span>
          </div>
        </div>

        {/* Supporting Stats list */}
        <div className="streak-stats-list">
          <div className="streak-stat-item">
            <div className="streak-stat-icon-bg purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="streak-stat-info">
              <span className="streak-stat-val">{longestStreak} days</span>
              <span className="streak-stat-lbl">Longest Streak</span>
            </div>
          </div>

          <div className="streak-stat-item">
            <div className="streak-stat-icon-bg green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="streak-stat-info">
              <span className="streak-stat-val">{activeDaysCount} days</span>
              <span className="streak-stat-lbl">Active Days (Last 90d)</span>
            </div>
          </div>

          <div className="streak-stat-item">
            <div className="streak-stat-icon-bg pink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="streak-stat-info">
              <span className="streak-stat-val">{totalContributions}</span>
              <span className="streak-stat-lbl">Total Contributions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
