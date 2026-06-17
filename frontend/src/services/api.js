import axios from 'axios';

// Resolve a URL base da API.
// Aceita uma URL completa (https://host/api) ou apenas o host, normalizando
// para https://host/api. Se vier so o nome do servico (sem ponto), o navegador
// nao resolve; por isso o render.yaml injeta a URL publica completa do backend.
function resolveApiUrl() {
  const raw = process.env.REACT_APP_API_URL;
  if (!raw) return 'http://localhost:8080/api';
  let url = raw.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  url = url.replace(/\/+$/, '');
  if (!/\/api$/i.test(url)) url = `${url}/api`;
  return url;
}

export const API_URL = resolveApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// Executa uma chamada com re-tentativas. No plano gratuito do Render o backend
// hiberna e a 1a chamada pode falhar (network/502/503/504) enquanto "acorda".
// onWaking() avisa a UI para mostrar o aviso de cold start.
export async function loadWithRetry(fn, { retries = 8, delay = 5000, onWaking } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err && err.response ? err.response.status : null;
      const coldStart = !err.response || [429, 502, 503, 504].includes(status);
      if (coldStart && attempt < retries) {
        if (onWaking) onWaking();
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}

// categoria: 1 = Psicologo, 2 = Fisioterapeuta, 3 = Medico
export const CATEGORIAS = { 1: 'Psicólogo', 2: 'Fisioterapeuta', 3: 'Médico' };
export const CATEGORIA_OPCOES = [
  { id: 1, nome: 'Psicólogo', cls: 'psico' },
  { id: 2, nome: 'Fisioterapeuta', cls: 'fisio' },
  { id: 3, nome: 'Médico', cls: 'medico' },
];
export const categoriaClasse = (c) => ({ 1: 'psico', 2: 'fisio', 3: 'medico' }[c] || 'psico');

export const profissionalService = {
  listar: () => api.get('/profissionais'),
  buscar: (id) => api.get(`/profissionais/${id}`),
  buscarPorNome: (nome) => api.get('/profissionais/buscar', { params: { nome } }),
  buscarPorCategoria: (categoria) => api.get(`/profissionais/categoria/${categoria}`),
  criar: (p) => api.post('/profissionais', p),
  atualizar: (id, p) => api.put(`/profissionais/${id}`, p),
  deletar: (id) => api.delete(`/profissionais/${id}`),
};

export const atendimentoService = {
  listar: () => api.get('/atendimentos'),
  buscar: (id) => api.get(`/atendimentos/${id}`),
  porProfissional: (pid) => api.get(`/atendimentos/profissional/${pid}`),
  criar: (a) => api.post('/atendimentos', a),
  atualizar: (id, a) => api.put(`/atendimentos/${id}`, a),
  deletar: (id) => api.delete(`/atendimentos/${id}`),
};

export const exameService = {
  listar: () => api.get('/exames'),
  buscar: (id) => api.get(`/exames/${id}`),
  porAtendimento: (aid) => api.get(`/exames/atendimento/${aid}`),
  criar: (e) => api.post('/exames', e),
  atualizar: (id, e) => api.put(`/exames/${id}`, e),
  deletar: (id) => api.delete(`/exames/${id}`),
};

export default api;
