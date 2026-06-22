import React, { useState } from 'react';
import './ReadmeGenerator.css';

export default function ReadmeGenerator({ profile, reposData, streakData }) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [includeStats, setIncludeStats] = useState(true);
  const [includeHealth, setIncludeHealth] = useState(true);
  const [includeLanguages, setIncludeLanguages] = useState(true);

  if (!profile) return null;

  // Calculate statistics
  const totalStars = reposData?.scoredRepos?.reduce((sum, r) => sum + (r.stargazers_count || 0), 0) || 0;
  const reposCount = profile.public_repos || 0;
  const followersCount = profile.followers || 0;
  const streakCount = streakData?.longestStreak || 0;
  
  const generateMarkdown = () => {
    let md = `# Hi there, I'm ${profile.name || profile.login} 👋\n\n`;
    
    if (profile.bio) {
      md += `> ${profile.bio}\n\n`;
    }

    md += `📍 Located in **${profile.location || 'the web'}**\n`;
    if (profile.company) {
      md += `🏢 Working at **${profile.company}**\n`;
    }
    if (profile.blog) {
      const blogUrl = profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`;
      md += `🌐 Portfolio/Website: [${profile.blog}](${blogUrl})\n`;
    }
    md += `\n---\n\n`;

    if (includeLanguages && reposData?.languages?.length > 0) {
      md += `### 🛠️ Top Programming Languages\n\n`;
      md += `\`\`\`\n`;
      reposData.languages.slice(0, 5).forEach(lang => {
        const progressBar = '█'.repeat(Math.round(lang.percentage / 10)) + '░'.repeat(10 - Math.round(lang.percentage / 10));
        md += `${lang.name.padEnd(15)} ${progressBar} ${lang.percentage}%\n`;
      });
      md += `\`\`\`\n\n`;
    }

    if (includeStats) {
      md += `### 📊 GitHub Analytics\n\n`;
      md += `- ⭐ **Total Stars**: ${totalStars}\n`;
      md += `- 📦 **Public Repositories**: ${reposCount}\n`;
      md += `- 🔥 **Longest Commit Streak**: ${streakCount} days\n`;
      md += `- 👥 **Followers**: ${followersCount}\n\n`;
    }

    if (includeHealth && reposData?.scoredRepos?.length > 0) {
      md += `### 🛡️ Featured Projects & Health Scores\n\n`;
      md += `| Repository | Primary Language | Health Rating |\n`;
      md += `| :--- | :--- | :---: |\n`;
      reposData.scoredRepos.slice(0, 5).forEach(repo => {
        let starsEmoji = '⭐️'.repeat(Math.min(repo.stargazers_count, 3)) || '⭐️';
        md += `| [${repo.name}](${repo.html_url}) | ${repo.language || 'N/A'} | ${repo.healthScore}% |\n`;
      });
      md += `\n`;
    }

    md += `\n*README generated automatically using [GitHub Profile Analyser](https://github.com/jabbarSoomro)* 🚀\n`;

    return md;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="readme-generator-panel glass-panel">
      <div className="panel-title">
        <svg className="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span>Profile README Generator</span>
        <button className="copy-readme-btn" onClick={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy Markdown'}
        </button>
      </div>

      <p className="readme-intro">
        Generate a beautiful, customized profile README.md using your verified metrics. Enable/disable blocks below and copy the resulting code!
      </p>

      <div className="generator-layout">
        <div className="generator-controls">
          <div className="control-option">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeLanguages}
                onChange={(e) => setIncludeLanguages(e.target.checked)}
              />
              <span>Top Languages Chart</span>
            </label>
          </div>
          <div className="control-option">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeStats}
                onChange={(e) => setIncludeStats(e.target.checked)}
              />
              <span>GitHub Analytics (Stars, Streaks)</span>
            </label>
          </div>
          <div className="control-option">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeHealth}
                onChange={(e) => setIncludeHealth(e.target.checked)}
              />
              <span>Top Repos Health Ratings</span>
            </label>
          </div>
        </div>

        <div className="readme-preview-container">
          <div className="preview-header">
            <span>Markdown Preview</span>
          </div>
          <pre className="readme-markdown-box">
            <code>{generateMarkdown()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
