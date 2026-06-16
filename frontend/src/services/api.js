import axios from 'axios';

// Resolve a URL base da API.
// Aceita tanto uma URL completa (ex.: https://host/api) quanto apenas o host
// (ex.: clinica-backend.onrender.com), normalizando para https://host/api.
// Isso permite que o render.yaml injete o host do backend via `fromService`.
function resolveApiUrl() {
  const raw = process.env.REACT_APP_API_URL;
  if (!raw) return 'http://localhost:8080/api';
  let url = raw.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  url = url.replace(/\/+$/, '');
  if (!/\/api$/i.test(url)) {
    url = `${url}/api`;
  }
  return url;
}

const API_URL = resolveApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// ========== PROFISSIONAIS DE SAUDE ==========
// categoria: 1 = Psicologo, 2 = Fisioterapeuta, 3 = Medico
export const profissionalService = {
  listar: () => api.get('/profissionais'),
  buscar: (id) => api.get(`/profissionais/${id}`),
  buscarPorNome: (nome) => api.get(`/profissionais/buscar`, { params: { nome } }),
  buscarPorCategoria: (categoria) => api.get(`/profissionais/categoria/${categoria}`),
  criar: (p) => api.post('/profissionais', p),
  atualizar: (id, p) => api.put(`/profissionais/${id}`, p),
  deletar: (id) => api.delete(`/profissionais/${id}`)
};

// ========== ATENDIMENTOS ==========
export const atendimentoService = {
  listar: () => api.get('/atendimentos'),
  buscar: (id) => api.get(`/atendimentos/${id}`),
  porProfissional: (profId) => api.get(`/atendimentos/profissional/${profId}`),
  criar: (a) => api.post('/atendimentos', a),
  atualizar: (id, a) => api.put(`/atendimentos/${id}`, a),
  deletar: (id) => api.delete(`/atendimentos/${id}`)
};

// ========== EXAMES DE LABORATORIO ==========
export const exameService = {
  listar: () => api.get('/exames'),
  buscar: (id) => api.get(`/exames/${id}`),
  porAtendimento: (atendId) => api.get(`/exames/atendimento/${atendId}`),
  criar: (e) => api.post('/exames', e),
  atualizar: (id, e) => api.put(`/exames/${id}`, e),
  deletar: (id) => api.delete(`/exames/${id}`)
};

// Rotulos das categorias de profissional (usado na UI)
export const CATEGORIAS = {
  1: 'Psicólogo',
  2: 'Fisioterapeuta',
  3: 'Médico'
};

export default api;
