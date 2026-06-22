import React from 'react';
import './ProfileHeader.css';

export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  return (
    <div className="glass-panel profile-header-container">
      <div className="profile-header-main">
        <div className="avatar-wrapper">
          <img
            src={profile.avatar_url}
            alt={`${profile.login}'s avatar`}
            className="profile-avatar"
          />
          <div className="avatar-glow-ring"></div>
          {/* Online status dot */}
          <div className="avatar-status-dot"></div>
        </div>

        <div className="profile-details">
          <h2 className="profile-name">{profile.name || profile.login}</h2>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="profile-username"
          >
            @{profile.login}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="external-icon">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          
          <div className="profile-meta-row">
            {profile.location && (
              <div className="profile-meta-item">
                <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{profile.location}</span>
              </div>
            )}

            {profile.blog && (
              <div className="profile-meta-item">
                <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noopener noreferrer" className="meta-link">
                  {profile.blog.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </div>
            )}

            {profile.company && (
              <div className="profile-meta-item">
                <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span>{profile.company}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <span className="stat-value">{formatNumber(profile.public_repos)}</span>
          <span className="stat-label">Repos</span>
        </div>
        <div className="profile-stat-card">
          <span className="stat-value">{formatNumber(profile.followers)}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="profile-stat-card">
          <span className="stat-value">{formatNumber(profile.following)}</span>
          <span className="stat-label">Following</span>
        </div>
        <div className="profile-stat-card">
          <span className="stat-value-date">{formatDate(profile.created_at)}</span>
          <span className="stat-label">Joined</span>
        </div>
      </div>
    </div>
  );
}
