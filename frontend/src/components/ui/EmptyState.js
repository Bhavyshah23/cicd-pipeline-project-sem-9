import React from 'react';

const EmptyState = ({ icon = '📭', title = 'No data found', description = 'There is nothing to display yet.' }) => (
  <div className="empty-state">
    <div className="empty-state-icon" aria-hidden="true">{icon}</div>
    <h3 className="empty-state-title">{title}</h3>
    <p className="empty-state-text">{description}</p>
  </div>
);

export default EmptyState;
