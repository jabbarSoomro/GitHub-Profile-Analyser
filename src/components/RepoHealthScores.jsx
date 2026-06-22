import React from 'react';
import './RepoHealthScores.css';

export default function RepoHealthScores({ scoredRepos }) {
  if (!scoredRepos || scoredRepos.length === 0) return null;

  // Show top 6 repos
  const topRepos = scoredRepos.slice(0, 6);

  const getHealthColor = (score) => {
    if (score < 40) return 'health-low';
    if (score < 70) return 'health-mid';
    return 'health-high';
  };

  const getHealthLabel = (score) => {
    if (score < 40) return 'Poor';
    if (score < 70) return 'Fair';
    return 'Excellent';
  };

  return (
    <div className="repo-health-section animate-fade-in">
      <h3 className="section-title">Repository Health Scores</h3>
      <p className="section-subtitle">
        Scored based on recent activity, stars, complete descriptions, issue ratios, and size.
      </p>

      <div className="repos-grid">
        {topRepos.map((repo) => {
          const healthClass = getHealthColor(repo.healthScore);
          const radius = 18;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (repo.healthScore / 100) * circumference;

          return (
            <div key={repo.id} className="glass-panel repo-card">
              <div className="repo-header">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-name-link"
                  title="View on GitHub"
                >
                  {repo.name}
                </a>

                {/* SVG circular progress ring */}
                <div className={`health-ring-wrapper ${healthClass}`} title={`Health score: ${repo.healthScore}/100 (${getHealthLabel(repo.healthScore)})`}>
                  <svg className="health-ring-svg">
                    <circle
                      className="health-ring-track"
                      cx="22"
                      cy="22"
                      r={radius}
                    />
                    <circle
                      className="health-ring-bar"
                      cx="22"
                      cy="22"
                      r={radius}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 22 22)"
                    />
                  </svg>
                  <span className="health-score-text">{repo.healthScore}</span>
                </div>
              </div>

              <p className="repo-description">
                {repo.description || <span className="no-desc">No description provided.</span>}
              </p>

              <div className="repo-footer">
                {repo.language && (
                  <span className="repo-lang">
                    <span className="lang-dot"></span>
                    {repo.language}
                  </span>
                )}
                
                <div className="repo-stats">
                  <span className="repo-stat" title="Stars">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    {repo.stargazers_count}
                  </span>
                  
                  <span className="repo-stat" title="Forks">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="3" x2="6" y2="15"></line>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    {repo.forks_count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
