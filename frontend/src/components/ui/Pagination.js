import React from 'react';

export default function Pagination({ page, pageSize, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const nums = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }

  return (
    <div className="tbl-foot">
      <span>Mostrando {from}–{to} de {total}</span>
      <div className="pager">
        <button onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Anterior">‹</button>
        {nums.map((n, i) => n === '…'
          ? <button key={`e${i}`} disabled>…</button>
          : <button key={n} className={n === page ? 'on' : ''} onClick={() => onPage(n)}>{n}</button>)}
        <button onClick={() => onPage(page + 1)} disabled={page >= pages} aria-label="Próxima">›</button>
      </div>
    </div>
  );
}
