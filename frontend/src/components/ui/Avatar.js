import React from 'react';

function initials(name) {
  if (!name) return '?';
  const parts = String(name).trim().replace(/^(dr|dra)\.?\s+/i, '').split(/\s+/);
  const first = parts[0] ? parts[0][0] : '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function colorIndex(seed) {
  const s = String(seed || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 6;
  return h;
}

export default function Avatar({ name, seed, size = 34, icon }) {
  const idx = colorIndex(seed != null ? seed : name);
  const fs = Math.round(size * 0.38);
  return (
    <div className={`av av-c${idx}`} style={{ width: size, height: size, fontSize: fs }}>
      {icon || initials(name)}
    </div>
  );
}
