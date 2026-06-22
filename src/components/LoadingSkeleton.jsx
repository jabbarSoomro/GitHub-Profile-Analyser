import React from 'react';
import './LoadingSkeleton.css';

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-container">
      {/* Row 1: Profile Header & Developer Card Skeletons */}
      <div className="skeleton-row">
        <div className="glass-panel skeleton-card header-skeleton">
          <div className="avatar-skeleton shimmer-bg"></div>
          <div className="info-skeleton">
            <div className="line shimmer-bg w-40"></div>
            <div className="line shimmer-bg w-30"></div>
            <div className="line shimmer-bg w-60 mt-4"></div>
          </div>
          <div className="stats-skeleton">
            <div className="stat-box shimmer-bg"></div>
            <div className="stat-box shimmer-bg"></div>
            <div className="stat-box shimmer-bg"></div>
          </div>
        </div>
        
        <div className="glass-panel skeleton-card card-skeleton">
          <div className="card-header-skeleton">
            <div className="avatar-small-skeleton shimmer-bg"></div>
            <div className="title-skeleton">
              <div className="line shimmer-bg w-30"></div>
              <div className="line shimmer-bg w-20"></div>
            </div>
          </div>
          <div className="card-body-skeleton">
            <div className="line shimmer-bg w-80"></div>
            <div className="line shimmer-bg w-70"></div>
            <div className="pills-skeleton">
              <div className="pill-skeleton shimmer-bg"></div>
              <div className="pill-skeleton shimmer-bg"></div>
              <div className="pill-skeleton shimmer-bg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Languages & Streaks */}
      <div className="skeleton-row">
        <div className="glass-panel skeleton-card chart-skeleton">
          <div className="line shimmer-bg w-40 mb-6"></div>
          <div className="donut-placeholder-container">
            <div className="donut-circle shimmer-bg"></div>
            <div className="legend-placeholder">
              <div className="legend-item-placeholder">
                <div className="dot-shimmer shimmer-bg"></div>
                <div className="line shimmer-bg w-20"></div>
              </div>
              <div className="legend-item-placeholder">
                <div className="dot-shimmer shimmer-bg"></div>
                <div className="line shimmer-bg w-20"></div>
              </div>
              <div className="legend-item-placeholder">
                <div className="dot-shimmer shimmer-bg"></div>
                <div className="line shimmer-bg w-20"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel skeleton-card streak-skeleton">
          <div className="line shimmer-bg w-40 mb-6"></div>
          <div className="streak-stats-placeholder">
            <div className="streak-metric-shimmer">
              <div className="circle-shimmer shimmer-bg"></div>
              <div className="line shimmer-bg w-30 mt-2"></div>
            </div>
            <div className="streak-metric-shimmer">
              <div className="circle-shimmer shimmer-bg"></div>
              <div className="line shimmer-bg w-30 mt-2"></div>
            </div>
            <div className="streak-metric-shimmer">
              <div className="circle-shimmer shimmer-bg"></div>
              <div className="line shimmer-bg w-30 mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Heatmap */}
      <div className="glass-panel skeleton-card heatmap-skeleton">
        <div className="line shimmer-bg w-30 mb-6"></div>
        <div className="grid-placeholder shimmer-bg"></div>
      </div>

      {/* Row 4: Repo Health */}
      <div className="repos-grid-skeleton">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass-panel repo-card-skeleton">
            <div className="repo-header-skeleton">
              <div className="line shimmer-bg w-60"></div>
              <div className="ring-shimmer shimmer-bg"></div>
            </div>
            <div className="line shimmer-bg w-80 mt-4"></div>
            <div className="line shimmer-bg w-40"></div>
            <div className="repo-footer-skeleton">
              <div className="line shimmer-bg w-20"></div>
              <div className="line shimmer-bg w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
