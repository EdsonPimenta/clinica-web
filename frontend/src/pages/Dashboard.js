import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { profissionalService, atendimentoService, exameService, loadWithRetry, CATEGORIAS, categoriaClasse } from '../services/api';
import { IconUsers, IconCalendar, IconFlask, IconClock } from '../components/ui/Icons';
import Avatar from '../components/ui/Avatar';
import { WakingBanner, ErrorBox } from '../components/ui/States';

const fmtData = (d) => (d ? d.split('-').reverse().join('/') : '');
const hoje = () => new Date().toISOString().slice(0, 10);

export default function Dashboard() {
  const nav = useNavigate();
  const [profs, setProfs] = useState([]);
  const [atend, setAtend] = useState([]);
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waking, setWaking] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null); setWaking(false);
    try {
      const [p, a, e] = await loadWithRetry(
        () => Promise.all([profissionalService.listar(), atendimentoService.listar(), exameService.listar()]),
        { onWaking: () => setWaking(true) }
      );
      setProfs(p.data || []); setAtend(a.data || []); setExames(e.data || []);
    } catch (err) {
      setError('Não foi possível carregar os dados.');
    } finally { setLoading(false); setWaking(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const porCat = [3, 2, 1].map((c) => ({ c, n: profs.filter((p) => p.categoria === c).length }));
  const totalCat = profs.length || 1;
  const corCat = { 3: '#15803d', 2: '#0e7490', 1: '#6d28d9' };
  let offset = 25;
  const segs = porCat.map(({ c, n }) => {
    const len = (n / totalCat) * 100;
    const seg = { c, dash: `${len} ${100 - len}`, off: offset };
    offset -= len;
    return seg;
  });

  const recentes = [...atend]
    .sort((a, b) => String(b.data).localeCompare(String(a.data)) || String(b.horario).localeCompare(String(a.horario)))
    .slice(0, 5);

  if (waking) return <WakingBanner />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-h"><div><h2>Visão geral</h2><p>Resumo da clínica</p></div></div>

      <div className="kpis">
        <Kpi icon={<IconUsers size={19} />} bg="var(--indigo-50)" tx="var(--indigo-600)" num={profs.length} lab="Profissionais" loading={loading} />
        <Kpi icon={<IconCalendar size={19} />} bg="var(--cyan-bg)" tx="var(--cyan-tx)" num={atend.length} lab="Atendimentos" loading={loading} />
        <Kpi icon={<IconFlask size={19} />} bg="var(--amber-bg)" tx="var(--amber-tx)" num={exames.length} lab="Exames" loading={loading} />
        <Kpi icon={<IconClock size={19} />} bg="var(--purple-bg)" tx="var(--purple-tx)" num={atend.filter((a) => a.data === hoje()).length} lab="Atendimentos hoje" loading={loading} />
      </div>

      <div className="grid2">
        <div className="card">
          <div className="ch"><h3>Profissionais por categoria</h3></div>
          <div className="donut-wrap">
            <svg viewBox="0 0 36 36" width="118" height="118">
              {segs.map((s) => (
                <circle key={s.c} cx="18" cy="18" r="15.9" fill="none" stroke={corCat[s.c]} strokeWidth="4" strokeDasharray={s.dash} strokeDashoffset={s.off} />
              ))}
              <text x="18" y="17.5" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="var(--text)">{profs.length}</text>
              <text x="18" y="23" textAnchor="middle" fontSize="2.6" fill="var(--muted)">profissionais</text>
            </svg>
            <div className="legend">
              {porCat.map(({ c, n }) => (
                <div className="li" key={c}><span className="sw" style={{ background: corCat[c] }} />{CATEGORIAS[c]}<b>{n}</b></div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="ch"><h3>Atendimentos recentes</h3><button className="linklike" onClick={() => nav('/atendimentos')}>Ver todos</button></div>
          {recentes.length === 0
            ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>Nenhum atendimento ainda.</p>
            : (
              <div className="act">
                {recentes.map((a) => (
                  <div className="it" key={a.id}>
                    <Avatar name={a.profissional && a.profissional.nome} seed={a.profissional && a.profissional.id} size={34} />
                    <div>
                      <div className="t">{(a.profissional && a.profissional.nome) || 'Sem profissional'} · <span className={`tx-${categoriaClasse(a.profissional && a.profissional.categoria)}`}>{CATEGORIAS[a.profissional && a.profissional.categoria] || ''}</span></div>
                      <div className="s">{a.problema || '—'}</div>
                    </div>
                    <div className="when">{fmtData(a.data)}{a.horario ? ` · ${String(a.horario).slice(0, 5)}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, bg, tx, num, lab, loading }) {
  return (
    <div className="kpi">
      <div className="ico" style={{ background: bg, color: tx }}>{icon}</div>
      <div className="num">{loading ? '—' : num}</div>
      <div className="lab">{lab}</div>
    </div>
  );
}
