import React, { createContext, useContext, useState, useCallback } from 'react';
import { IconCheck, IconAlert, IconClose } from '../components/ui/Icons';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

let seq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((type, title, desc) => {
    const id = ++seq;
    setToasts((t) => [...t, { id, type, title, desc }]);
    setTimeout(() => remove(id), 4200);
  }, [remove]);

  const toast = {
    success: (title, desc) => push('success', title, desc),
    error: (title, desc) => push('error', title, desc),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <div className="toast-ico">{t.type === 'success' ? <IconCheck size={18} /> : <IconAlert size={18} />}</div>
            <div className="toast-body">
              <b>{t.title}</b>
              {t.desc && <span>{t.desc}</span>}
            </div>
            <button className="toast-x" onClick={() => remove(t.id)} aria-label="Fechar"><IconClose size={15} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
