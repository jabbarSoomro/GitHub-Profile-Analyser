import React, { useState } from 'react';
import './ShareButton.css';

export default function ShareButton({ profile }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const shareUrl = window.location.origin + '?user=' + profile.login;
  const shareText = `Check out ${profile.name || profile.login}'s GitHub Profile Analysis — languages, streaks, repo health & more!`;

  const handleTriggerClick = () => {
    setShowMenu(!showMenu);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'GitHub Profile Analysis', text: shareText, url: shareUrl });
        setShowMenu(false);
      } catch (e) { /* user cancelled */ }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const openTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const openLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  return (
    <div className="share-wrapper">
      <button className="share-trigger-btn" onClick={handleTriggerClick} title="Share profile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        Share
      </button>

      {showMenu && (
        <>
          <div className="share-backdrop" onClick={() => setShowMenu(false)}></div>
          <div className="share-menu glass-panel">
            {navigator.share && (
              <>
                <button onClick={handleNativeShare} className="share-option">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  System Share
                </button>
                <div className="share-divider"></div>
              </>
            )}
            <button onClick={openTwitter} className="share-option">
              <span className="share-icon twitter">𝕏</span> Twitter / X
            </button>
            <button onClick={openLinkedIn} className="share-option">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </button>
            <button onClick={openWhatsApp} className="share-option">
              <span className="share-icon whatsapp">💬</span> WhatsApp
            </button>
            <div className="share-divider"></div>
            <button onClick={handleCopyLink} className="share-option">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
