import React, { useEffect } from 'react';

const Modal = ({ title, children, onClose, size = 'default' }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={onClose} role="presentation">
      <section className={`modal ${size === 'large' ? 'modal-lg' : ''}`} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          {title && <h2 id="modal-title">{title}</h2>}
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        {children}
      </section>
    </div>
  );
};

export default Modal;
