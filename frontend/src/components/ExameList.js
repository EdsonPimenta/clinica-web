import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exameService } from '../services/api';

function ExameList() {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const response = await exameService.listar();
      setExames(response.data);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este exame?')) {
      try {
        await exameService.deletar(id);
        carregar();
      } catch (error) {
        console.error('Erro ao deletar exame:', error);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div className="header">
        <h2>🔬 Exames de Laboratório</h2>
        <Link to="/exames/novo" className="btn btn-primary">+ Novo Exame</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Data</th>
            <th>Resultado</th>
            <th>Atendimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {exames.map(ex => (
            <tr key={ex.id}>
              <td>{ex.descricao}</td>
              <td>{ex.data}</td>
              <td>{ex.resultado}</td>
              <td>{ex.atendimento ? `#${ex.atendimento.id}` : '-'}</td>
              <td>
                <Link to={`/exames/editar/${ex.id}`} className="btn btn-sm">Editar</Link>
                <button onClick={() => deletar(ex.id)} className="btn btn-danger btn-sm">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {exames.length === 0 && <p className="empty">Nenhum exame cadastrado.</p>}
    </div>
  );
}

export default ExameList;
