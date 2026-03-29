import { db, hasFirebaseConfig } from '../lib/firebase.js';
import { mockProjects } from './projects.mock.js';

let localProjects = [...mockProjects];

const COLLECTION = 'projects';

function normalizeProject(project) {
  return {
    id: project.id,
    name: project.name,
    description: project.description || '',
    status: project.status || 'In Progress',
    stars: Number(project.stars || 0),
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : String(project.technologies || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    thumbnail: project.thumbnail || '',
    liveDemoUrl: project.live_demo_url || project.liveDemoUrl || '#',
    githubUrl: project.github_url || project.githubUrl || '#',
    category: project.category || 'General',
    createdAt: project.created_at || project.createdAt || '',
    updatedAt: project.updated_at || project.updatedAt || '',
  };
}

export async function findAllProjects() {
  if (!hasFirebaseConfig || !db) return localProjects;

  try {
    const snapshot = await db.collection(COLLECTION).orderBy('created_at', 'desc').get();
    return snapshot.docs.map((doc) => normalizeProject({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local projects list: ${error.message}`);
    return localProjects;
  }
}

export async function findProjectById(projectId) {
  if (!hasFirebaseConfig || !db) {
    const project = localProjects.find((item) => String(item.id) === String(projectId));
    if (!project) throw new Error('Khong tim thay du an.');
    return project;
  }

  try {
    const doc = await db.collection(COLLECTION).doc(projectId).get();
    if (!doc.exists) throw new Error('Khong tim thay du an.');
    return normalizeProject({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local project detail ${projectId}: ${error.message}`);
    const project = localProjects.find((item) => String(item.id) === String(projectId));
    if (!project) throw error;
    return project;
  }
}

export async function createProject(payload) {
  const projectData = normalizeProject(payload);

  if (!hasFirebaseConfig || !db) {
    const timestamp = new Date().toISOString();
    const newProject = { ...projectData, id: `p_${Date.now()}`, createdAt: timestamp, updatedAt: timestamp };
    localProjects = [newProject, ...localProjects];
    return newProject;
  }

  try {
    const createdAt = new Date().toISOString();
    const docRef = await db.collection(COLLECTION).add({
      name: projectData.name,
      description: projectData.description,
      status: projectData.status,
      stars: projectData.stars,
      technologies: projectData.technologies,
      thumbnail: projectData.thumbnail,
      live_demo_url: projectData.liveDemoUrl,
      github_url: projectData.githubUrl,
      category: projectData.category,
      created_at: createdAt,
      updated_at: createdAt,
    });

    return normalizeProject({ id: docRef.id, ...projectData, created_at: createdAt, updated_at: createdAt });
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local project create: ${error.message}`);
    const timestamp = new Date().toISOString();
    const newProject = { ...projectData, id: `p_${Date.now()}`, createdAt: timestamp, updatedAt: timestamp };
    localProjects = [newProject, ...localProjects];
    return newProject;
  }
}

export async function updateProject(projectId, payload) {
  const projectData = normalizeProject(payload);

  if (!hasFirebaseConfig || !db) {
    const idx = localProjects.findIndex((p) => String(p.id) === String(projectId));
    if (idx < 0) throw new Error('Khong tim thay du an can cap nhat.');
    const updatedAt = new Date().toISOString();
    localProjects[idx] = { ...localProjects[idx], ...projectData, id: localProjects[idx].id, updatedAt };
    return localProjects[idx];
  }

  try {
    const docRef = db.collection(COLLECTION).doc(projectId);
    await docRef.update({
      name: projectData.name,
      description: projectData.description,
      status: projectData.status,
      stars: projectData.stars,
      technologies: projectData.technologies,
      thumbnail: projectData.thumbnail,
      live_demo_url: projectData.liveDemoUrl,
      github_url: projectData.githubUrl,
      category: projectData.category,
      updated_at: new Date().toISOString(),
    });

    const updated = await docRef.get();
    return normalizeProject({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local project update ${projectId}: ${error.message}`);
    const idx = localProjects.findIndex((p) => String(p.id) === String(projectId));
    if (idx < 0) throw error;
    const updatedAt = new Date().toISOString();
    localProjects[idx] = { ...localProjects[idx], ...projectData, id: localProjects[idx].id, updatedAt };
    return localProjects[idx];
  }
}

export async function deleteProject(projectId) {
  if (!hasFirebaseConfig || !db) {
    const prev = localProjects.length;
    localProjects = localProjects.filter((p) => String(p.id) !== String(projectId));
    if (localProjects.length === prev) throw new Error('Khong tim thay du an can xoa.');
    return { id: projectId };
  }

  try {
    await db.collection(COLLECTION).doc(projectId).delete();
    return { id: projectId };
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local project delete ${projectId}: ${error.message}`);
    const prev = localProjects.length;
    localProjects = localProjects.filter((p) => String(p.id) !== String(projectId));
    if (localProjects.length === prev) throw error;
    return { id: projectId };
  }
}
