const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/api/projects`);

  if (!response.ok) {
    throw new Error("Không thể tải danh sách dự án từ máy chủ.");
  }

  const payload = await response.json();
  return payload?.data || [];
}
