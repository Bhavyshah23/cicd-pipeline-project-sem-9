import React from 'react';

const StatCard = ({ icon, value, label, valueColor }) => (
  <article className="stat-card">
    <div className="stat-icon" aria-hidden="true">{icon}</div>
    <div><div className="stat-label">{label}</div><div className="stat-value" style={valueColor ? { color: valueColor } : undefined}>{value}</div></div>
  </article>
);

export default StatCard;
