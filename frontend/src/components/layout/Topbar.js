import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconSearch } from '../ui/Icons';

const TITLES = {
  '/': ['Dashboard', 'Início / Visão geral'],
  '/profissionais': ['Profissionais', 'Início / Cadastros'],
  '/atendimentos': ['Atendimentos', 'Início / Atendimentos'],
  '/exames': ['Exames', 'Início / Exames'],
  '/configuracoes': ['Configurações', 'Início / Sistema'],
};

export default function Topbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [q, setQ] = useState('');
  const [title, crumb] = TITLES[pathname] || ['Clínica Web', 'Início'];

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    nav(term ? `/profissionais?q=${encodeURIComponent(term)}` : '/profissionais');
    setQ('');
  };

  return (
    <header className="top">
      <div>
        <h1>{title}</h1>
        <div className="crumb">{crumb}</div>
      </div>
      <form className="search" onSubmit={submit} role="search">
        <IconSearch size={16} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar profissional..." aria-label="Buscar profissional" />
      </form>
    </header>
  );
}
