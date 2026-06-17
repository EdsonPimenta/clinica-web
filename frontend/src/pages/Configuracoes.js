import React, { useState } from 'react';
import { profissionalService, CATEGORIA_OPCOES, API_URL } from '../services/api';
import useList from '../hooks/useList';
import { IconExternal, IconGithub } from '../components/ui/Icons';

const COR_CAT = { 1: '#6d28d9', 2: '#0e7490', 3: '#15803d' };
const STORAGE = 'clinica-tema';

const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
const apiBase = API_URL.replace(/\/api$/, '');
const LINKS = [
  { label: 'Aplicação (frontend)', url: appUrl, Icon: IconExternal },
  { label: 'API REST', url: `${apiBase}/api/profissionais`, Icon: IconExternal },
  { label: 'Documentação Swagger', url: `${apiBase}/swagger-ui.html`, Icon: IconExternal },
  { label: 'Repositório no GitHub', url: 'https://github.com/EdsonPimenta/clinica-web', Icon: IconGithub },
];

export default function Configuracoes() {
  const { data: profs } = useList(() => profissionalService.listar());
  const [dark, setDark] = useState(() => (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE) === 'dark'));

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '');
    try { window.localStorage.setItem(STORAGE, next ? 'dark' : 'light'); } catch (e) { /* ignore */ }
  };

  const count = (c) => profs.filter((p) => p.categoria === c).length;

  return (
    <div>
      <div className="page-h"><div><h2>Configurações</h2><p>Preferências de exibição e informações do sistema</p></div></div>

      <div className="set-grid">
        <div className="card">
          <h3>Aparência</h3>
          <p className="csub">Preferência visual salva no navegador.</p>
          <div className="set-row">
            <div><div className="t">Modo escuro</div><div className="s">Interface em tons escuros</div></div>
            <button className={`switch${dark ? ' on' : ''}`} onClick={toggleDark} aria-label="Alternar modo escuro" />
          </div>
        </div>

        <div className="card">
          <h3>Categorias de profissionais</h3>
          <p className="csub">Definidas pelo sistema (campo categoria 1–3).</p>
          {CATEGORIA_OPCOES.map((o) => (
            <div className="cat-row" key={o.id}>
              <span className="cat-dot" style={{ background: COR_CAT[o.id] }} />
              <b>{o.nome}</b>
              <span style={{ fontSize: 12, color: 'var(--muted2)', marginLeft: 8 }}>categoria {o.id}</span>
              <span className="cnt">{count(o.id)}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3>Sobre o sistema</h3>
          <p className="csub">Aplicação publicada no Render.</p>
          <div className="stack">
            {['Spring Boot 3.2', 'React 18', 'PostgreSQL', 'Docker', 'GitHub Actions', 'Render'].map((s) => <span className="pill" key={s}>{s}</span>)}
          </div>
          <div className="links">
            {LINKS.map(({ label, url, Icon }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"><Icon size={17} />{label}<span className="ext"><IconExternal size={14} /></span></a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
