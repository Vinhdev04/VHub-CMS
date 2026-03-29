import { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects.api';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    window.addEventListener('cms:refresh-data', fetchAll);
    return () => window.removeEventListener('cms:refresh-data', fetchAll);
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Đã có lỗi khi tải danh sách dự án.');
    } finally {
      setLoading(false);
    }
  }

  async function createProjectItem(payload) {
    await createProject(payload);
    await fetchAll();
  }

  async function updateProjectItem(id, payload) {
    await updateProject(id, payload);
    await fetchAll();
  }

  async function deleteProjectItem(id) {
    await deleteProject(id);
    await fetchAll();
  }

  return { projects, loading, error, fetchAll, createProjectItem, updateProjectItem, deleteProjectItem };
}
