import { findAllProjects } from "./projects.repository.js";

export async function getProjectList() {
  return findAllProjects();
}
