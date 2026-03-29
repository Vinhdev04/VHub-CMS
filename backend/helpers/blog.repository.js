import { db, hasFirebaseConfig } from '../lib/firebase.js';
import { mockBlogPosts } from './blog.mock.js';

let localBlogPosts = [...mockBlogPosts];

const COLLECTION = 'blog_posts';

function normalizePost(post) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content || '',
    tags: Array.isArray(post.tags)
      ? post.tags
      : String(post.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    views: Number(post.views || 0),
    likes: Number(post.likes || 0),
    status: post.status || 'Draft',
    readTime: post.read_time || post.readTime || '',
    publishedAt: post.published_at || post.publishedAt || '',
    createdAt: post.created_at || post.createdAt || '',
    updatedAt: post.updated_at || post.updatedAt || '',
  };
}

export async function findAllBlogPosts() {
  if (!hasFirebaseConfig || !db) return localBlogPosts;

  try {
    const snapshot = await db.collection(COLLECTION).orderBy('created_at', 'desc').get();
    return snapshot.docs.map((doc) => normalizePost({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local blog list: ${error.message}`);
    return localBlogPosts;
  }
}

export async function findBlogPostById(postId) {
  if (!hasFirebaseConfig || !db) {
    const post = localBlogPosts.find((item) => String(item.id) === String(postId));
    if (!post) throw new Error('Khong tim thay bai viet.');
    return post;
  }

  try {
    const doc = await db.collection(COLLECTION).doc(postId).get();
    if (!doc.exists) throw new Error('Khong tim thay bai viet.');
    return normalizePost({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local blog detail ${postId}: ${error.message}`);
    const post = localBlogPosts.find((item) => String(item.id) === String(postId));
    if (!post) throw error;
    return post;
  }
}

export async function createBlogPost(payload) {
  const postData = normalizePost(payload);

  if (!hasFirebaseConfig || !db) {
    const timestamp = new Date().toISOString();
    const newPost = {
      ...postData,
      id: `b_${Date.now()}`,
      publishedAt: postData.publishedAt || timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    localBlogPosts = [newPost, ...localBlogPosts];
    return newPost;
  }

  try {
    const createdAt = new Date().toISOString();
    const publishedAt = postData.publishedAt || createdAt;
    const docRef = await db.collection(COLLECTION).add({
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      tags: postData.tags,
      views: postData.views,
      likes: postData.likes,
      status: postData.status,
      read_time: postData.readTime,
      published_at: publishedAt,
      created_at: createdAt,
      updated_at: createdAt,
    });

    return normalizePost({
      id: docRef.id,
      ...postData,
      published_at: publishedAt,
      created_at: createdAt,
      updated_at: createdAt,
    });
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local blog create: ${error.message}`);
    const timestamp = new Date().toISOString();
    const newPost = {
      ...postData,
      id: `b_${Date.now()}`,
      publishedAt: postData.publishedAt || timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    localBlogPosts = [newPost, ...localBlogPosts];
    return newPost;
  }
}

export async function updateBlogPost(postId, payload) {
  const postData = normalizePost(payload);

  if (!hasFirebaseConfig || !db) {
    const idx = localBlogPosts.findIndex((p) => String(p.id) === String(postId));
    if (idx < 0) throw new Error('Khong tim thay bai viet can cap nhat.');
    const updatedAt = new Date().toISOString();
    localBlogPosts[idx] = { ...localBlogPosts[idx], ...postData, id: localBlogPosts[idx].id, updatedAt };
    return localBlogPosts[idx];
  }

  try {
    const docRef = db.collection(COLLECTION).doc(postId);
    await docRef.update({
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      tags: postData.tags,
      views: postData.views,
      likes: postData.likes,
      status: postData.status,
      read_time: postData.readTime,
      published_at: postData.publishedAt || '',
      updated_at: new Date().toISOString(),
    });

    const updated = await docRef.get();
    return normalizePost({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local blog update ${postId}: ${error.message}`);
    const idx = localBlogPosts.findIndex((p) => String(p.id) === String(postId));
    if (idx < 0) throw error;
    const updatedAt = new Date().toISOString();
    localBlogPosts[idx] = { ...localBlogPosts[idx], ...postData, id: localBlogPosts[idx].id, updatedAt };
    return localBlogPosts[idx];
  }
}

export async function deleteBlogPost(postId) {
  if (!hasFirebaseConfig || !db) {
    const prev = localBlogPosts.length;
    localBlogPosts = localBlogPosts.filter((p) => String(p.id) !== String(postId));
    if (localBlogPosts.length === prev) throw new Error('Khong tim thay bai viet can xoa.');
    return { id: postId };
  }

  try {
    await db.collection(COLLECTION).doc(postId).delete();
    return { id: postId };
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local blog delete ${postId}: ${error.message}`);
    const prev = localBlogPosts.length;
    localBlogPosts = localBlogPosts.filter((p) => String(p.id) !== String(postId));
    if (localBlogPosts.length === prev) throw error;
    return { id: postId };
  }
}
