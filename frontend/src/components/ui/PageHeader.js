import React from 'react';

const PageHeader = ({ title, subtitle, action }) => (
  <div className="page-header">
    <div>
      <h1>{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default PageHeader;
