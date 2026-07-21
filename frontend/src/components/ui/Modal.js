import React from 'react';

const Modal = ({ title, children, onClose, size = 'default' }) => (
  <div className="modal-overlay" onClick={onClose} role="presentation">
    <div
      className={`modal ${size === 'large' ? 'modal-lg' : ''}`}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {title && <h2 id="modal-title">{title}</h2>}
      {children}
    </div>
  </div>
);

export default Modal;
