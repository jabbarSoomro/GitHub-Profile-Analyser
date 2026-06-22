import React, { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import './DeveloperCard.css';

export default function DeveloperCard({ profile, languages, streakData }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  if (!profile) return null;

  // Extract top 3 languages
  const topLanguages = languages ? languages.slice(0, 3) : [];
  const currentStreak = streakData ? streakData.currentStreak : 0;
  const activeDays = streakData ? streakData.activeDaysCount : 0;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportError('');

    try {
      // Small delay to ensure all assets are rendered and layout stabilizes
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '600px',
          height: '340px'
        },
        width: 600,
        height: 340,
      });

      saveAs(dataUrl, `github-profile-${profile.login}.png`);
    } catch (err) {
      console.error('Failed to export image:', err);
      setExportError('Export failed. Trying fallback method...');
      
      // Fallback method using simple SVG or alerts
      try {
        const dataUrl = await htmlToImage.toJpeg(cardRef.current, { quality: 0.95 });
        saveAs(dataUrl, `github-profile-${profile.login}.jpg`);
      } catch (fallbackErr) {
        setExportError('Failed to generate card. CORS or browser limitations.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="dev-card-section">
      <div className="section-header" style={{ justifyContent: 'center' }}>
        <div className="section-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        </div>
        <div className="section-header-text">
          <h3>Developer Card</h3>
        </div>
      </div>
      
      {/* Outer container containing the card and controls */}
      <div className="dev-card-container">
        
        {/* The DOM element we will export. Styled as an absolute-positioned beautiful item */}
        <div className="dev-card-exportable" ref={cardRef}>
          {/* Glowing backdrop meshes inside the card */}
          <div className="card-mesh mesh-1"></div>
          <div className="card-mesh mesh-2"></div>
          
          <div className="card-content">
            <div className="card-header">
              <div className="card-avatar-wrapper">
                <img
                  src={`${profile.avatar_url}&s=100`}
                  alt=""
                  className="card-avatar"
                  crossOrigin="anonymous" // CRITICAL: Allows canvas reads without CORS taint
                />
                <div className="card-avatar-ring"></div>
              </div>
              
              <div className="card-user-info">
                <h4 className="card-name">{profile.name || profile.login}</h4>
                <span className="card-username">github.com/{profile.login}</span>
                {profile.bio && (
                  <p className="card-bio">
                    {profile.bio.length > 80 ? `${profile.bio.substring(0, 77)}...` : profile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Middle panel showing top languages */}
            <div className="card-languages">
              <span className="card-section-lbl">Top Stacks</span>
              <div className="card-lang-pills">
                {topLanguages.length > 0 ? (
                  topLanguages.map((lang, idx) => (
                    <span key={idx} className="card-lang-pill">
                      {lang.name}
                    </span>
                  ))
                ) : (
                  <span className="card-lang-pill">GitHub Developer</span>
                )}
              </div>
            </div>

            {/* Footer row containing metrics & badge */}
            <div className="card-footer">
              <div className="card-metrics">
                <div className="card-metric">
                  <span className="metric-val">{profile.public_repos}</span>
                  <span className="metric-lbl">Repos</span>
                </div>
                <div className="card-metric">
                  <span className="metric-val">{profile.followers}</span>
                  <span className="metric-lbl">Followers</span>
                </div>
                <div className="card-metric">
                  <span className="metric-val">{currentStreak}🔥</span>
                  <span className="metric-lbl">Streak</span>
                </div>
                <div className="card-metric">
                  <span className="metric-val">{activeDays}</span>
                  <span className="metric-lbl">Active Days</span>
                </div>
              </div>

              <div className="card-badge">
                <span className="badge-text">PROFILE ANALYSER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="card-controls">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="export-btn"
          >
            {isExporting ? (
              <>
                <span className="spinner small"></span>
                <span>Generating Card...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-icon">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download Dev Card PNG</span>
              </>
            )}
          </button>
          
          {exportError && <span className="export-error">{exportError}</span>}
        </div>
      </div>
    </div>
  );
}
