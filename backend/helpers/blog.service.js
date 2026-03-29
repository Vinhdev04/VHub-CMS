import {
  findBlogPostById,
  findAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../helpers/blog.repository.js';

export async function getBlogPostList() {
  return findAllBlogPosts();
}

export async function getBlogPostDetail(postId) {
  return findBlogPostById(postId);
}

export async function createBlogPostItem(payload) {
  return createBlogPost(payload);
}

export async function updateBlogPostItem(postId, payload) {
  return updateBlogPost(postId, payload);
}

export async function deleteBlogPostItem(postId) {
  return deleteBlogPost(postId);
}
