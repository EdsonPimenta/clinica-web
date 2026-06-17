import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { profissionalService, CATEGORIAS, CATEGORIA_OPCOES, categoriaClasse } from '../services/api';
import useList from '../hooks/useList';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import { EmptyState, TableSkeleton, WakingBanner, ErrorBox } from '../components/ui/States';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconUsers } from '../components/ui/Icons';

const PAGE = 8;

export default function Profissionais() {
  const { data, loading, waking, error, reload } = useList(() => profissionalService.listar());
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [busca, setBusca] = useState(params.get('q') || '');
  const [cat, setCat] = useState(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);     // objeto em edição/criação
  const [del, setDel] = useState(null);       // objeto a excluir
  const [busy, setBusy] = useState(false);

  useEffect(() => { setBusca(params.get('q') || ''); }, [params]);
  useEffect(() => { setPage(1); }, [busca, cat]);

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return data
      .filter((p) => (cat ? p.categoria === cat : true))
      .filter((p) => (t ? (p.nome || '').toLowerCase().includes(t) : true))
      .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
  }, [data, busca, cat]);

  const pageItems = filtrados.slice((page - 1) * PAGE, page * PAGE);

  const onBusca = (v) => { setBusca(v); const np = new URLSearchParams(params); if (v) np.set('q', v); else np.delete('q'); setParams(np, { replace: true }); };

  const salvar = async (dados, id) => {
    setBusy(true);
    try {
      const payload = { ...dados, categoria: parseInt(dados.categoria, 10) };
      if (id) await profissionalService.atualizar(id, payload);
      else await profissionalService.criar(payload);
      toast.success(id ? 'Profissional atualizado' : 'Profissional cadastrado', dados.nome);
      setForm(null);
      reload();
    } catch (e) {
      toast.error('Erro ao salvar', 'Tente novamente em instantes.');
    } finally { setBusy(false); }
  };

  const excluir = async () => {
    setBusy(true);
    try {
      await profissionalService.deletar(del.id);
      toast.success('Profissional removido', del.nome);
      setDel(null);
      reload();
    } catch (e) {
      toast.error('Erro ao excluir', 'Tente novamente.');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="page-h">
        <div><h2>Profissionais de saúde</h2><p>{data.length} profissionais cadastrados</p></div>
        <button className="btn primary" onClick={() => setForm({})}><IconPlus size={16} /> Novo profissional</button>
      </div>

      <div className="toolbar">
        <div className="search" style={{ width: 280 }}>
          <IconSearch size={16} />
          <input value={busca} onChange={(e) => onBusca(e.target.value)} placeholder="Buscar por nome..." />
        </div>
        <span className={`chip${cat === null ? ' on' : ''}`} onClick={() => setCat(null)}>Todos</span>
        {CATEGORIA_OPCOES.map((o) => (
          <span key={o.id} className={`chip${cat === o.id ? ' on' : ''}`} onClick={() => setCat(o.id)}>{o.nome}s</span>
        ))}
      </div>

      {waking && <WakingBanner />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {!error && (
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Profissional</th><th>Categoria</th><th>Telefone</th><th>Endereço</th><th className="right">Ações</th></tr></thead>
            {!loading && (
              <tbody>
                {pageItems.map((p) => (
                  <tr key={p.id}>
                    <td><div className="person"><Avatar name={p.nome} seed={p.id} /><div><b>{p.nome}</b><span>#{p.id}</span></div></div></td>
                    <td><span className={`badge b-${categoriaClasse(p.categoria)}`}>{CATEGORIAS[p.categoria] || p.categoria}</span></td>
                    <td>{p.telefone || <span className="muted-cell">—</span>}</td>
                    <td>{p.endereco || <span className="muted-cell">—</span>}</td>
                    <td><div className="act-btns">
                      <button onClick={() => setForm(p)} title="Editar"><IconEdit size={15} /></button>
                      <button className="del" onClick={() => setDel(p)} title="Excluir"><IconTrash size={15} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {loading && <TableSkeleton cols={5} />}
          {!loading && filtrados.length === 0 && (
            <EmptyState icon={<IconUsers size={22} />} title="Nenhum profissional encontrado" hint={busca || cat ? 'Ajuste a busca ou o filtro.' : 'Cadastre o primeiro profissional.'} />
          )}
          {!loading && filtrados.length > 0 && <Pagination page={page} pageSize={PAGE} total={filtrados.length} onPage={setPage} />}
        </div>
      )}

      {form && <ProfForm inicial={form} busy={busy} onClose={() => setForm(null)} onSave={salvar} />}
      {del && <ConfirmDialog title="Excluir profissional" message={`Tem certeza que deseja excluir "${del.nome}"? Esta ação não pode ser desfeita.`} busy={busy} onCancel={() => setDel(null)} onConfirm={excluir} />}
    </div>
  );
}

function ProfForm({ inicial, busy, onClose, onSave }) {
  const editar = !!inicial.id;
  const [v, setV] = useState({ nome: inicial.nome || '', categoria: inicial.categoria || 1, telefone: inicial.telefone || '', endereco: inicial.endereco || '' });
  const ch = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const submit = (e) => { e.preventDefault(); onSave(v, inicial.id); };

  return (
    <Modal title={editar ? 'Editar profissional' : 'Novo profissional'} onClose={onClose}
      footer={<>
        <button className="btn" onClick={onClose} disabled={busy}>Cancelar</button>
        <button className="btn primary" form="prof-form" type="submit" disabled={busy || !v.nome.trim()}>{busy ? 'Salvando...' : 'Salvar'}</button>
      </>}>
      <form id="prof-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="fg"><label>Nome *</label><input value={v.nome} onChange={ch('nome')} required autoFocus /></div>
        <div className="fg two">
          <div className="fg"><label>Categoria *</label>
            <select value={v.categoria} onChange={ch('categoria')}>
              {CATEGORIA_OPCOES.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
            </select>
          </div>
          <div className="fg"><label>Telefone</label><input value={v.telefone} onChange={ch('telefone')} /></div>
        </div>
        <div className="fg"><label>Endereço</label><input value={v.endereco} onChange={ch('endereco')} /></div>
      </form>
    </Modal>
  );
}
