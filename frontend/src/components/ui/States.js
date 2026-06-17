import React from 'react';
import { IconRefresh } from './Icons';

export function EmptyState({ icon, title, hint }) {
  return (
    <div className="empty">
      <div className="eico">{icon}</div>
      <b>{title}</b>
      {hint && <span>{hint}</span>}
    </div>
  );
}

export function TableSkeleton({ cols = 5, rows = 5 }) {
  return (
    <table>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((__, c) => (
              <td key={c}><div className="skeleton" style={{ width: c === 0 ? '70%' : '55%' }} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function WakingBanner() {
  return (
    <div className="banner">
      <IconRefresh size={17} className="spin" />
      <span>O servidor está acordando (plano gratuito do Render). Isso leva ~30–60s na primeira vez. Aguarde...</span>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="error-box">
      <span>{message || 'Não foi possível carregar os dados.'}</span>
      {onRetry && <button className="btn" onClick={onRetry}>Tentar de novo</button>}
    </div>
  );
}
