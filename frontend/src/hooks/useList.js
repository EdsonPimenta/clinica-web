import { useState, useEffect, useCallback, useRef } from 'react';
import { loadWithRetry } from '../services/api';

// Carrega uma lista da API com tratamento de loading, erro e cold start (Render free).
export default function useList(fetchFn, deps = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waking, setWaking] = useState(false);
  const [error, setError] = useState(null);
  const fnRef = useRef(fetchFn);
  fnRef.current = fetchFn;

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    setWaking(false);
    try {
      const res = await loadWithRetry(() => fnRef.current(), { onWaking: () => setWaking(true) });
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError('Não foi possível conectar à API. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
      setWaking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, deps);

  return { data, loading, waking, error, reload, setData };
}
