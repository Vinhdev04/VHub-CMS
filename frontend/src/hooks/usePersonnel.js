import { useCallback, useEffect, useState } from 'react';
import {
  getPersonnel,
  createPersonnel as apiCreate,
  updatePersonnel as apiUpdate,
  deletePersonnel as apiDelete,
} from '../api/personnel.api';

export function usePersonnel() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchPersonnel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPersonnel();
      setPersonnel(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonnel();
  }, [fetchPersonnel]);

  useEffect(() => {
    window.addEventListener('cms:refresh-data', fetchPersonnel);
    return () => window.removeEventListener('cms:refresh-data', fetchPersonnel);
  }, [fetchPersonnel]);

  async function createPersonnelItem(payload) {
    const created = await apiCreate(payload);
    setPersonnel((prev) => [created, ...prev]);
    return created;
  }

  async function updatePersonnelItem(id, payload) {
    const updated = await apiUpdate(id, payload);
    setPersonnel((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, ...updated } : p)),
    );
    return updated;
  }

  async function deletePersonnelItem(id) {
    await apiDelete(id);
    setPersonnel((prev) => prev.filter((p) => String(p.id) !== String(id)));
  }

  return {
    personnel,
    loading,
    error,
    refetch: fetchPersonnel,
    createPersonnelItem,
    updatePersonnelItem,
    deletePersonnelItem,
  };
}
