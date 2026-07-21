import React from 'react';

const PageHeader = ({ title, subtitle, action }) => (
  <header className="page-header">
    <div className="page-header-copy">
      <h1>{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
    {action && <div className="page-header-action">{action}</div>}
  </header>
);

export default PageHeader;
