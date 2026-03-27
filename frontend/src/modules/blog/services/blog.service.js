const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function getBlogPosts() {
  const response = await fetch(`${API_BASE_URL}/api/blog-posts`);
  if (!response.ok) {
    throw new Error("Không thể tải danh sách bài viết.");
  }
  const payload = await response.json();
  return payload?.data || [];
}

export async function createBlogPost(payload) {
  const response = await fetch(`${API_BASE_URL}/api/blog-posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Không thể tạo bài viết.");
  }
  const result = await response.json();
  return result?.data;
}

export async function updateBlogPost(postId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/blog-posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Không thể cập nhật bài viết.");
  }
  const result = await response.json();
  return result?.data;
}

export async function deleteBlogPost(postId) {
  const response = await fetch(`${API_BASE_URL}/api/blog-posts/${postId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Không thể xóa bài viết.");
  }
  const result = await response.json();
  return result?.data;
}
