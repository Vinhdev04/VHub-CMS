import { useEffect, useState } from 'react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../api/blog.api';

export function useBlogPosts() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setPosts(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Đã có lỗi khi tải danh sách bài viết.');
    } finally {
      setLoading(false);
    }
  }

  async function createPost(payload) {
    await createBlogPost(payload);
    await fetchAll();
  }

  async function updatePost(id, payload) {
    await updateBlogPost(id, payload);
    await fetchAll();
  }

  async function deletePost(id) {
    await deleteBlogPost(id);
    await fetchAll();
  }

  return { posts, loading, error, fetchAll, createPost, updatePost, deletePost };
}
