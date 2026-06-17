import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({ title, message, confirmLabel = 'Excluir', onCancel, onConfirm, busy }) {
  return (
    <Modal
      title={title}
      size="sm"
      onClose={onCancel}
      footer={(
        <>
          <button className="btn" onClick={onCancel} disabled={busy}>Cancelar</button>
          <button className="btn primary" style={{ background: 'var(--red)', borderColor: 'var(--red)' }} onClick={onConfirm} disabled={busy}>
            {busy ? 'Removendo...' : confirmLabel}
          </button>
        </>
      )}
    >
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}
