import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-container">
    <div className="spinner" aria-hidden="true" />
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
