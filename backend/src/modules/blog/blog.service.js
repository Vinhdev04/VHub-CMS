import {
  createBlogPost,
  deleteBlogPost,
  findAllBlogPosts,
  updateBlogPost,
} from "./blog.repository.js";

export async function getBlogPostList() {
  return findAllBlogPosts();
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
