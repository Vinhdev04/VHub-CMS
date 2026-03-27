const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/api/projects`);

  if (!response.ok) {
    throw new Error("Không thể tải danh sách dự án từ máy chủ.");
  }

  const payload = await response.json();
  return payload?.data || [];
}

export async function createProject(projectPayload) {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectPayload),
  });

  if (!response.ok) {
    throw new Error("Không thể tạo dự án mới.");
  }

  const payload = await response.json();
  return payload?.data;
}

export async function updateProject(projectId, projectPayload) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectPayload),
  });

  if (!response.ok) {
    throw new Error("Không thể cập nhật dự án.");
  }

  const payload = await response.json();
  return payload?.data;
}

export async function deleteProject(projectId) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Không thể xóa dự án.");
  }

  const payload = await response.json();
  return payload?.data;
}
