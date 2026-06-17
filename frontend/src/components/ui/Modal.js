import React, { useEffect } from 'react';
import { IconClose } from './Icons';

export default function Modal({ title, onClose, children, footer, size }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal${size === 'sm' ? ' sm' : ''}`} role="dialog" aria-modal="true">
        <div className="mh">
          <h3>{title}</h3>
          <button className="iconbtn" onClick={onClose} aria-label="Fechar"><IconClose size={17} /></button>
        </div>
        <div className="mb">{children}</div>
        {footer && <div className="mf">{footer}</div>}
      </div>
    </div>
  );
}
