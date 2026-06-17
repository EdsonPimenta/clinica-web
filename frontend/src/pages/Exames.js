import React, { useState, useMemo, useEffect } from 'react';
import { exameService, atendimentoService } from '../services/api';
import useList from '../hooks/useList';
import { useToast } from '../context/ToastContext';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import { EmptyState, TableSkeleton, WakingBanner, ErrorBox } from '../components/ui/States';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconFlask } from '../components/ui/Icons';

const PAGE = 8;
const fmtData = (d) => (d ? d.split('-').reverse().join('/') : '');
const atendLabel = (a) => (a ? `#${a.id} · ${fmtData(a.data)}${a.profissional ? ` · ${a.profissional.nome}` : ''}` : '');

export default function Exames() {
  const { data, loading, waking, error, reload } = useList(() => exameService.listar());
  const { data: atends } = useList(() => atendimentoService.listar());
  const toast = useToast();
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setPage(1); }, [busca]);

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return data
      .filter((e) => (t ? `${e.descricao || ''} ${e.resultado || ''}`.toLowerCase().includes(t) : true))
      .sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')));
  }, [data, busca]);

  const pageItems = filtrados.slice((page - 1) * PAGE, page * PAGE);

  const salvar = async (v, id) => {
    setBusy(true);
    try {
      const payload = {
        descricao: v.descricao,
        resultado: v.resultado || null,
        data: v.data || null,
        atendimento: v.atendimentoId ? { id: parseInt(v.atendimentoId, 10) } : null,
      };
      if (id) await exameService.atualizar(id, payload);
      else await exameService.criar(payload);
      toast.success(id ? 'Exame atualizado' : 'Exame cadastrado', v.descricao);
      setForm(null); reload();
    } catch (e) { toast.error('Erro ao salvar', 'Tente novamente.'); }
    finally { setBusy(false); }
  };

  const excluir = async () => {
    setBusy(true);
    try { await exameService.deletar(del.id); toast.success('Exame removido', del.descricao); setDel(null); reload(); }
    catch (e) { toast.error('Erro ao excluir'); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <div className="page-h">
        <div><h2>Exames de laboratório</h2><p>Solicitações vinculadas aos atendimentos</p></div>
        <button className="btn primary" onClick={() => setForm({})}><IconPlus size={16} /> Novo exame</button>
      </div>

      <div className="toolbar">
        <div className="search" style={{ width: 300 }}><IconSearch size={16} /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar exame por descrição..." /></div>
      </div>

      {waking && <WakingBanner />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {!error && (
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Exame</th><th>Atendimento</th><th>Data</th><th>Resultado</th><th className="right">Ações</th></tr></thead>
            {!loading && (
              <tbody>
                {pageItems.map((e) => (
                  <tr key={e.id}>
                    <td><div className="person"><div className="av av-c5" style={{ width: 30, height: 30 }}><IconFlask size={15} /></div><div><b>{e.descricao}</b><span>#{e.id}</span></div></div></td>
                    <td className="muted-cell">{e.atendimento ? `#${e.atendimento.id}${e.atendimento.profissional ? ` · ${e.atendimento.profissional.nome}` : ''}` : '—'}</td>
                    <td>{e.data ? fmtData(e.data) : <span className="muted-cell">—</span>}</td>
                    <td className="muted-cell">{e.resultado || '—'}</td>
                    <td><div className="act-btns">
                      <button onClick={() => setForm(e)} title="Editar"><IconEdit size={15} /></button>
                      <button className="del" onClick={() => setDel(e)} title="Excluir"><IconTrash size={15} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {loading && <TableSkeleton cols={5} />}
          {!loading && filtrados.length === 0 && <EmptyState icon={<IconFlask size={22} />} title="Nenhum exame encontrado" hint={busca ? 'Ajuste a busca.' : 'Cadastre o primeiro exame.'} />}
          {!loading && filtrados.length > 0 && <Pagination page={page} pageSize={PAGE} total={filtrados.length} onPage={setPage} />}
        </div>
      )}

      {form && <ExameForm inicial={form} atends={atends} busy={busy} onClose={() => setForm(null)} onSave={salvar} />}
      {del && <ConfirmDialog title="Excluir exame" message={`Tem certeza que deseja excluir "${del.descricao}"?`} busy={busy} onCancel={() => setDel(null)} onConfirm={excluir} />}
    </div>
  );
}

function ExameForm({ inicial, atends, busy, onClose, onSave }) {
  const [v, setV] = useState({
    descricao: inicial.descricao || '',
    atendimentoId: (inicial.atendimento && inicial.atendimento.id) || '',
    data: inicial.data || '',
    resultado: inicial.resultado || '',
  });
  const ch = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const submit = (e) => { e.preventDefault(); onSave(v, inicial.id); };

  return (
    <Modal title={inicial.id ? 'Editar exame' : 'Novo exame'} onClose={onClose}
      footer={<>
        <button className="btn" onClick={onClose} disabled={busy}>Cancelar</button>
        <button className="btn primary" form="exame-form" type="submit" disabled={busy || !v.descricao.trim()}>{busy ? 'Salvando...' : 'Salvar'}</button>
      </>}>
      <form id="exame-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="fg"><label>Descrição *</label><input value={v.descricao} onChange={ch('descricao')} required autoFocus /></div>
        <div className="fg"><label>Atendimento vinculado</label>
          <select value={v.atendimentoId} onChange={ch('atendimentoId')}>
            <option value="">Selecione um atendimento</option>
            {atends.map((a) => <option key={a.id} value={a.id}>{atendLabel(a)}</option>)}
          </select>
        </div>
        <div className="fg"><label>Data</label><input type="date" value={v.data} onChange={ch('data')} /></div>
        <div className="fg"><label>Resultado</label><textarea value={v.resultado} onChange={ch('resultado')} /></div>
      </form>
    </Modal>
  );
}
