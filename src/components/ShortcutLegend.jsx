import React from 'react';
import './ShortcutLegend.css';

export default function ShortcutLegend({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="legend-overlay" onClick={onClose}></div>
      <div className="legend-modal glass-panel animate-fade-in">
        <div className="legend-header">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
              <line x1="6" y1="8" x2="6" y2="8"/>
              <line x1="10" y1="8" x2="10" y2="8"/>
              <line x1="14" y1="8" x2="14" y2="8"/>
              <line x1="18" y1="8" x2="18" y2="8"/>
              <line x1="6" y1="12" x2="6" y2="12"/>
              <line x1="10" y1="12" x2="10" y2="12"/>
              <line x1="14" y1="12" x2="14" y2="12"/>
              <line x1="18" y1="12" x2="18" y2="12"/>
              <line x1="7" y1="16" x2="17" y2="16"/>
            </svg>
            Keyboard Shortcuts
          </h3>
          <button className="legend-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="legend-body">
          <div className="shortcut-row">
            <span className="shortcut-label">Toggle Dark/Light Mode</span>
            <kbd className="shortcut-key">t</kbd>
          </div>
          <div className="shortcut-row">
            <span className="shortcut-label">Open Settings Drawer</span>
            <kbd className="shortcut-key">s</kbd>
          </div>
          <div className="shortcut-row">
            <span className="shortcut-label">Focus Search Input</span>
            <kbd className="shortcut-key">/</kbd>
          </div>
          <div className="shortcut-row">
            <span className="shortcut-label">Show Keyboard Shortcuts Help</span>
            <kbd className="shortcut-key">?</kbd>
          </div>
          <div className="shortcut-row">
            <span className="shortcut-label">Close Active Modal / Drawer</span>
            <kbd className="shortcut-key">Esc</kbd>
          </div>
        </div>

        <div className="legend-footer">
          Press any of these keys globally to trigger the actions.
        </div>
      </div>
    </>
  );
}
