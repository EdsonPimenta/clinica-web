import React, { useState, useMemo, useEffect } from 'react';
import { atendimentoService, profissionalService, CATEGORIAS } from '../services/api';
import useList from '../hooks/useList';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import { EmptyState, TableSkeleton, WakingBanner, ErrorBox } from '../components/ui/States';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconCalendar, IconClock } from '../components/ui/Icons';

const PAGE = 8;
const fmtData = (d) => (d ? d.split('-').reverse().join('/') : '');
const hoje = () => new Date().toISOString().slice(0, 10);

export default function Atendimentos() {
  const { data, loading, waking, error, reload } = useList(() => atendimentoService.listar());
  const { data: profs } = useList(() => profissionalService.listar());
  const toast = useToast();
  const [busca, setBusca] = useState('');
  const [dataFiltro, setDataFiltro] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setPage(1); }, [busca, dataFiltro]);

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return data
      .filter((a) => (dataFiltro ? a.data === dataFiltro : true))
      .filter((a) => (t ? `${a.problema || ''} ${(a.profissional && a.profissional.nome) || ''}`.toLowerCase().includes(t) : true))
      .sort((a, b) => String(b.data).localeCompare(String(a.data)) || String(b.horario).localeCompare(String(a.horario)));
  }, [data, busca, dataFiltro]);

  const pageItems = filtrados.slice((page - 1) * PAGE, page * PAGE);

  const salvar = async (v, id) => {
    setBusy(true);
    try {
      const payload = {
        data: v.data,
        horario: v.horario || null,
        problema: v.problema || null,
        receita: v.receita || null,
        profissional: v.profissionalId ? { id: parseInt(v.profissionalId, 10) } : null,
      };
      if (id) await atendimentoService.atualizar(id, payload);
      else await atendimentoService.criar(payload);
      toast.success(id ? 'Atendimento atualizado' : 'Atendimento registrado');
      setForm(null); reload();
    } catch (e) { toast.error('Erro ao salvar', 'Tente novamente.'); }
    finally { setBusy(false); }
  };

  const excluir = async () => {
    setBusy(true);
    try { await atendimentoService.deletar(del.id); toast.success('Atendimento removido'); setDel(null); reload(); }
    catch (e) { toast.error('Erro ao excluir'); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <div className="page-h">
        <div><h2>Atendimentos</h2><p>Registro de atendimentos por profissional</p></div>
        <button className="btn primary" onClick={() => setForm({})}><IconPlus size={16} /> Novo atendimento</button>
      </div>

      <div className="mini-kpis">
        <div className="mini"><div className="ico" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)' }}><IconCalendar size={18} /></div><div><div className="num">{data.length}</div><div className="lab">Total de atendimentos</div></div></div>
        <div className="mini"><div className="ico" style={{ background: 'var(--cyan-bg)', color: 'var(--cyan-tx)' }}><IconClock size={18} /></div><div><div className="num">{data.filter((a) => a.data === hoje()).length}</div><div className="lab">Na data de hoje</div></div></div>
      </div>

      <div className="toolbar">
        <div className="search" style={{ width: 240 }}><IconSearch size={16} /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar atendimento..." /></div>
        <div className="search" style={{ width: 190 }}><IconCalendar size={15} /><input type="date" value={dataFiltro} onChange={(e) => setDataFiltro(e.target.value)} aria-label="Filtrar por data" /></div>
        {dataFiltro && <button className="chip" onClick={() => setDataFiltro('')}>Limpar data</button>}
      </div>

      {waking && <WakingBanner />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {!error && (
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Data / hora</th><th>Profissional</th><th>Problema / queixa</th><th>Receita / recomendação</th><th className="right">Ações</th></tr></thead>
            {!loading && (
              <tbody>
                {pageItems.map((a) => (
                  <tr key={a.id}>
                    <td><b>{fmtData(a.data)}</b> <span className="muted-cell">{a.horario ? String(a.horario).slice(0, 5) : ''}</span></td>
                    <td>{a.profissional ? (
                      <div className="person"><Avatar name={a.profissional.nome} seed={a.profissional.id} size={30} /><div><b>{a.profissional.nome}</b><span>{CATEGORIAS[a.profissional.categoria] || ''}</span></div></div>
                    ) : <span className="muted-cell">—</span>}</td>
                    <td>{a.problema || <span className="muted-cell">—</span>}</td>
                    <td className="muted-cell">{a.receita || '—'}</td>
                    <td><div className="act-btns">
                      <button onClick={() => setForm(a)} title="Editar"><IconEdit size={15} /></button>
                      <button className="del" onClick={() => setDel(a)} title="Excluir"><IconTrash size={15} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {loading && <TableSkeleton cols={5} />}
          {!loading && filtrados.length === 0 && <EmptyState icon={<IconCalendar size={22} />} title="Nenhum atendimento encontrado" hint={busca || dataFiltro ? 'Ajuste a busca ou a data.' : 'Registre o primeiro atendimento.'} />}
          {!loading && filtrados.length > 0 && <Pagination page={page} pageSize={PAGE} total={filtrados.length} onPage={setPage} />}
        </div>
      )}

      {form && <AtendForm inicial={form} profs={profs} busy={busy} onClose={() => setForm(null)} onSave={salvar} />}
      {del && <ConfirmDialog title="Excluir atendimento" message="Tem certeza que deseja excluir este atendimento?" busy={busy} onCancel={() => setDel(null)} onConfirm={excluir} />}
    </div>
  );
}

function AtendForm({ inicial, profs, busy, onClose, onSave }) {
  const [v, setV] = useState({
    profissionalId: (inicial.profissional && inicial.profissional.id) || '',
    data: inicial.data || '',
    horario: inicial.horario ? String(inicial.horario).slice(0, 5) : '',
    problema: inicial.problema || '',
    receita: inicial.receita || '',
  });
  const ch = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const submit = (e) => { e.preventDefault(); onSave(v, inicial.id); };

  return (
    <Modal title={inicial.id ? 'Editar atendimento' : 'Novo atendimento'} onClose={onClose}
      footer={<>
        <button className="btn" onClick={onClose} disabled={busy}>Cancelar</button>
        <button className="btn primary" form="atend-form" type="submit" disabled={busy || !v.data || !v.profissionalId}>{busy ? 'Salvando...' : 'Salvar'}</button>
      </>}>
      <form id="atend-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="fg"><label>Profissional *</label>
          <select value={v.profissionalId} onChange={ch('profissionalId')} required>
            <option value="">Selecione um profissional</option>
            {profs.map((p) => <option key={p.id} value={p.id}>{p.nome} — {CATEGORIAS[p.categoria]}</option>)}
          </select>
        </div>
        <div className="fg two">
          <div className="fg"><label>Data *</label><input type="date" value={v.data} onChange={ch('data')} required /></div>
          <div className="fg"><label>Hora</label><input type="time" value={v.horario} onChange={ch('horario')} /></div>
        </div>
        <div className="fg"><label>Problema / queixa</label><textarea value={v.problema} onChange={ch('problema')} /></div>
        <div className="fg"><label>Receita / recomendação</label><textarea value={v.receita} onChange={ch('receita')} placeholder="Remédio (médico), atividade física (fisio) ou atividades mentais (psicólogo)" /></div>
      </form>
    </Modal>
  );
}
