import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { atendimentoService, profissionalService } from '../services/api';

function AtendimentoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [atendimento, setAtendimento] = useState({
    data: '', horario: '', problema: '', receita: '', profissional: null
  });
  const [profissionais, setProfissionais] = useState([]);

  useEffect(() => {
    profissionalService.listar().then(res => setProfissionais(res.data));
    if (id) {
      atendimentoService.buscar(id).then(res => setAtendimento(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await atendimentoService.atualizar(id, atendimento);
      } else {
        await atendimentoService.criar(atendimento);
      }
      navigate('/atendimentos');
    } catch (error) {
      console.error('Erro ao salvar atendimento:', error);
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Atendimento' : 'Novo Atendimento'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Profissional *</label>
          <select value={atendimento.profissional?.id || ''} required
            onChange={e => setAtendimento({...atendimento,
              profissional: e.target.value ? {id: parseInt(e.target.value, 10)} : null})}>
            <option value="">Selecione um profissional</option>
            {profissionais.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Data *</label>
          <input type="date" value={atendimento.data} required
            onChange={e => setAtendimento({...atendimento, data: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Hora</label>
          <input type="time" value={atendimento.horario || ''}
            onChange={e => setAtendimento({...atendimento, horario: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Problema / Queixa</label>
          <textarea value={atendimento.problema || ''}
            onChange={e => setAtendimento({...atendimento, problema: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Receita / Recomendação</label>
          <textarea value={atendimento.receita || ''}
            placeholder="Remédio (médico), atividade física (fisioterapeuta) ou atividades mentais (psicólogo)"
            onChange={e => setAtendimento({...atendimento, receita: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary">Salvar</button>
        <button type="button" className="btn" onClick={() => navigate('/atendimentos')}>Cancelar</button>
      </form>
    </div>
  );
}

export default AtendimentoForm;
