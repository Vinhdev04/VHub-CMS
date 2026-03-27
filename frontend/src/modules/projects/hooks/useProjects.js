import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projects.service";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
      setError("");
    } catch (err) {
      setError(err.message || "Đã có lỗi khi tải danh sách dự án.");
    } finally {
      setLoading(false);
    }
  }

  async function createProjectItem(projectPayload) {
    await createProject(projectPayload);
    await fetchProjects();
  }

  async function updateProjectItem(projectId, projectPayload) {
    await updateProject(projectId, projectPayload);
    await fetchProjects();
  }

  async function deleteProjectItem(projectId) {
    await deleteProject(projectId);
    await fetchProjects();
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProjectItem,
    updateProjectItem,
    deleteProjectItem,
  };
}
