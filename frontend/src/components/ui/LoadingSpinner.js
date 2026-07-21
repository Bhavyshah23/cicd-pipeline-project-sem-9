import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', compact = false }) => (
  <div className={`loading-container ${compact ? 'loading-compact' : ''}`} role="status">
    <div className="spinner" aria-hidden="true" />
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
