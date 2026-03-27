import { supabase } from "../../config/supabase.js";
import { hasSupabaseConfig } from "../../config/env.js";
import { mockProjects } from "./projects.mock.js";

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
    return mockProjects;
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
