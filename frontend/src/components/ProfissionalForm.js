import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { profissionalService } from '../services/api';

function ProfissionalForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profissional, setProfissional] = useState({
    nome: '', telefone: '', endereco: '', categoria: 1
  });

  useEffect(() => {
    if (id) {
      profissionalService.buscar(id).then(res => setProfissional(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = { ...profissional, categoria: parseInt(profissional.categoria, 10) };
      if (id) {
        await profissionalService.atualizar(id, dados);
      } else {
        await profissionalService.criar(dados);
      }
      navigate('/profissionais');
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Profissional' : 'Novo Profissional'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Nome *</label>
          <input type="text" value={profissional.nome} required
            onChange={e => setProfissional({...profissional, nome: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Categoria *</label>
          <select value={profissional.categoria} required
            onChange={e => setProfissional({...profissional, categoria: e.target.value})}>
            <option value={1}>Psicólogo</option>
            <option value={2}>Fisioterapeuta</option>
            <option value={3}>Médico</option>
          </select>
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input type="text" value={profissional.telefone || ''}
            onChange={e => setProfissional({...profissional, telefone: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Endereço</label>
          <input type="text" value={profissional.endereco || ''}
            onChange={e => setProfissional({...profissional, endereco: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary">Salvar</button>
        <button type="button" className="btn" onClick={() => navigate('/profissionais')}>Cancelar</button>
      </form>
    </div>
  );
}

export default ProfissionalForm;
