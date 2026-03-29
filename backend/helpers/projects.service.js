import {
  findProjectById,
  findAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../helpers/projects.repository.js';

export async function getProjectList() {
  return findAllProjects();
}

export async function getProjectDetail(projectId) {
  return findProjectById(projectId);
}

export async function createProjectItem(payload) {
  return createProject(payload);
}

export async function updateProjectItem(projectId, payload) {
  return updateProject(projectId, payload);
}

export async function deleteProjectItem(projectId) {
  return deleteProject(projectId);
}
