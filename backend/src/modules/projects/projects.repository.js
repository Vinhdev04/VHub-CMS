import { supabase } from "../../config/supabase.js";
import { hasSupabaseConfig } from "../../config/env.js";
import { mockProjects } from "./projects.mock.js";

let localProjects = [...mockProjects];

function normalizeProject(project) {
  return {
    id: project.id,
    name: project.name,
    description: project.description || "",
    status: project.status || "In Progress",
    stars: Number(project.stars || 0),
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : String(project.technologies || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    thumbnail: project.thumbnail || "",
    liveDemoUrl: project.live_demo_url || project.liveDemoUrl || "#",
    githubUrl: project.github_url || project.githubUrl || "#",
  };
}

export async function findAllProjects() {
  if (!hasSupabaseConfig || !supabase) {
    return localProjects;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(normalizeProject);
}

export async function createProject(projectPayload) {
  const projectData = normalizeProject(projectPayload);

  if (!hasSupabaseConfig || !supabase) {
    const newProject = {
      ...projectData,
      id: `p_${Date.now()}`,
    };
    localProjects = [newProject, ...localProjects];
    return newProject;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: projectData.name,
      description: projectData.description,
      status: projectData.status,
      stars: projectData.stars,
      technologies: projectData.technologies,
      thumbnail: projectData.thumbnail,
      live_demo_url: projectData.liveDemoUrl,
      github_url: projectData.githubUrl,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeProject(data);
}

export async function updateProject(projectId, projectPayload) {
  const projectData = normalizeProject(projectPayload);

  if (!hasSupabaseConfig || !supabase) {
    const index = localProjects.findIndex((project) => String(project.id) === String(projectId));
    if (index < 0) {
      throw new Error("Không tìm thấy dự án cần cập nhật.");
    }
    localProjects[index] = { ...localProjects[index], ...projectData, id: localProjects[index].id };
    return localProjects[index];
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      name: projectData.name,
      description: projectData.description,
      status: projectData.status,
      stars: projectData.stars,
      technologies: projectData.technologies,
      thumbnail: projectData.thumbnail,
      live_demo_url: projectData.liveDemoUrl,
      github_url: projectData.githubUrl,
    })
    .eq("id", projectId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeProject(data);
}

export async function deleteProject(projectId) {
  if (!hasSupabaseConfig || !supabase) {
    const previousLength = localProjects.length;
    localProjects = localProjects.filter((project) => String(project.id) !== String(projectId));
    if (localProjects.length === previousLength) {
      throw new Error("Không tìm thấy dự án cần xóa.");
    }
    return { id: projectId };
  }

  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) {
    throw new Error(error.message);
  }
  return { id: projectId };
}
