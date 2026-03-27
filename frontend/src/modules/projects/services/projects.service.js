import { mockProjects } from "../data/mockProjects";

export async function getProjects() {
  return Promise.resolve(mockProjects);
}
