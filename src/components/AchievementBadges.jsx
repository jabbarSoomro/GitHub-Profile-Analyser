import React from 'react';
import './AchievementBadges.css';

export default function AchievementBadges({ profile, reposData, streakData }) {
  if (!profile) return null;

  // Calculate stats
  const totalStars = reposData?.scoredRepos?.reduce((sum, r) => sum + (r.stargazers_count || 0), 0) || 0;
  const reposCount = profile.public_repos || 0;
  const followersCount = profile.followers || 0;
  const streakCount = streakData?.longestStreak || 0;
  const languageCount = reposData?.languages?.length || 0;
  
  // Calculate average health
  const totalHealth = reposData?.scoredRepos?.reduce((sum, r) => sum + r.healthScore, 0) || 0;
  const avgHealth = reposData?.scoredRepos?.length > 0 ? Math.round(totalHealth / reposData.scoredRepos.length) : 0;

  // Define badges
  const badgeDefinitions = [
    {
      id: 'streak_3',
      name: 'Flame On',
      desc: 'Achieve a 3+ day active contribution streak',
      condition: streakCount >= 3,
      icon: '🔥',
      color: 'gold-orange'
    },
    {
      id: 'streak_7',
      name: 'Git Legend',
      desc: 'Achieve a 7+ day active contribution streak',
      condition: streakCount >= 7,
      icon: '⚡',
      color: 'purple-pink'
    },
    {
      id: 'repos_10',
      name: 'Creator',
      desc: 'Own 10+ public repositories',
      condition: reposCount >= 10,
      icon: '📦',
      color: 'blue-cyan'
    },
    {
      id: 'repos_30',
      name: 'Code Factory',
      desc: 'Own 30+ public repositories',
      condition: reposCount >= 30,
      icon: '🏭',
      color: 'purple-blue'
    },
    {
      id: 'stars_10',
      name: 'Superstar',
      desc: 'Accumulate 10+ stars across all repositories',
      condition: totalStars >= 10,
      icon: '⭐',
      color: 'amber-yellow'
    },
    {
      id: 'stars_100',
      name: 'Galactic Hit',
      desc: 'Accumulate 100+ stars across all repositories',
      condition: totalStars >= 100,
      icon: '🌌',
      color: 'ruby-red'
    },
    {
      id: 'followers_50',
      name: 'Influencer',
      desc: 'Have 50+ GitHub followers',
      condition: followersCount >= 50,
      icon: '📣',
      color: 'emerald-green'
    },
    {
      id: 'polyglot',
      name: 'Polyglot',
      desc: 'Use 4+ different programming languages',
      condition: languageCount >= 4,
      icon: '🌍',
      color: 'cyan-teal'
    },
    {
      id: 'health_85',
      name: 'Quality First',
      desc: 'Maintain average Repository Health above 85%',
      condition: avgHealth >= 85 && reposData?.scoredRepos?.length > 0,
      icon: '🛡️',
      color: 'emerald-teal'
    }
  ];

  const unlockedCount = badgeDefinitions.filter(b => b.condition).length;

  return (
    <div className="achievement-badges-panel glass-panel">
      <div className="panel-title">
        <svg className="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
        <span>Developer Achievements</span>
        <span className="badges-unlocked-pill">{unlockedCount} / {badgeDefinitions.length} Unlocked</span>
      </div>

      <div className="badges-grid">
        {badgeDefinitions.map(badge => (
          <div key={badge.id} className={`badge-card ${badge.condition ? 'unlocked' : 'locked'}`}>
            <div className={`badge-icon-wrapper ${badge.color}`}>
              <span className="badge-icon-emoji">{badge.icon}</span>
              {!badge.condition && <div className="lock-overlay">🔒</div>}
            </div>
            <div className="badge-info">
              <span className="badge-name">{badge.name}</span>
              <span className="badge-desc">{badge.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
