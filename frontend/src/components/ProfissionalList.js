import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profissionalService, CATEGORIAS } from '../services/api';

function ProfissionalList() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async (categoria = '') => {
    setLoading(true);
    try {
      const response = categoria
        ? await profissionalService.buscarPorCategoria(categoria)
        : await profissionalService.listar();
      setProfissionais(response.data);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltro = (e) => {
    const cat = e.target.value;
    setFiltroCategoria(cat);
    carregar(cat);
  };

  const deletar = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        await profissionalService.deletar(id);
        carregar(filtroCategoria);
      } catch (error) {
        console.error('Erro ao deletar profissional:', error);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div className="header">
        <h2>👩‍⚕️ Profissionais de Saúde</h2>
        <Link to="/profissionais/novo" className="btn btn-primary">+ Novo Profissional</Link>
      </div>

      <div className="toolbar">
        <label htmlFor="filtro">Filtrar por categoria:</label>
        <select id="filtro" value={filtroCategoria} onChange={handleFiltro}>
          <option value="">Todas</option>
          <option value="1">Psicólogo</option>
          <option value="2">Fisioterapeuta</option>
          <option value="3">Médico</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {profissionais.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td><span className={`badge badge-${p.categoria}`}>{CATEGORIAS[p.categoria] || p.categoria}</span></td>
              <td>{p.telefone}</td>
              <td>{p.endereco}</td>
              <td>
                <Link to={`/profissionais/editar/${p.id}`} className="btn btn-sm">Editar</Link>
                <button onClick={() => deletar(p.id)} className="btn btn-danger btn-sm">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {profissionais.length === 0 && <p className="empty">Nenhum profissional cadastrado.</p>}
    </div>
  );
}

export default ProfissionalList;
