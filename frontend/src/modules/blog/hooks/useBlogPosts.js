import { useEffect, useState } from "react";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPosts,
  updateBlogPost,
} from "../services/blog.service";

export function useBlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setPosts(data);
      setError("");
    } catch (err) {
      setError(err.message || "Đã có lỗi khi tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  }

  async function createPost(payload) {
    await createBlogPost(payload);
    await fetchPosts();
  }

  async function updatePost(postId, payload) {
    await updateBlogPost(postId, payload);
    await fetchPosts();
  }

  async function deletePost(postId) {
    await deleteBlogPost(postId);
    await fetchPosts();
  }

  return { posts, loading, error, createPost, updatePost, deletePost };
}
