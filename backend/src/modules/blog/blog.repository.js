import { supabase } from "../../config/supabase.js";
import { hasSupabaseConfig } from "../../config/env.js";
import { mockBlogPosts } from "./blog.mock.js";

let localBlogPosts = [...mockBlogPosts];

function normalizePost(post) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    tags: Array.isArray(post.tags)
      ? post.tags
      : String(post.tags || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    views: Number(post.views || 0),
    likes: Number(post.likes || 0),
    status: post.status || "Draft",
    readTime: post.read_time || post.readTime || "",
  };
}

export async function findAllBlogPosts() {
  if (!hasSupabaseConfig || !supabase) {
    return localBlogPosts;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(normalizePost);
}

export async function createBlogPost(payload) {
  const postData = normalizePost(payload);
  if (!hasSupabaseConfig || !supabase) {
    const newPost = { ...postData, id: `b_${Date.now()}` };
    localBlogPosts = [newPost, ...localBlogPosts];
    return newPost;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: postData.title,
      excerpt: postData.excerpt,
      tags: postData.tags,
      views: postData.views,
      likes: postData.likes,
      status: postData.status,
      read_time: postData.readTime,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizePost(data);
}

export async function updateBlogPost(postId, payload) {
  const postData = normalizePost(payload);
  if (!hasSupabaseConfig || !supabase) {
    const index = localBlogPosts.findIndex((post) => String(post.id) === String(postId));
    if (index < 0) {
      throw new Error("Không tìm thấy bài viết cần cập nhật.");
    }
    localBlogPosts[index] = { ...localBlogPosts[index], ...postData, id: localBlogPosts[index].id };
    return localBlogPosts[index];
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: postData.title,
      excerpt: postData.excerpt,
      tags: postData.tags,
      views: postData.views,
      likes: postData.likes,
      status: postData.status,
      read_time: postData.readTime,
    })
    .eq("id", postId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizePost(data);
}

export async function deleteBlogPost(postId) {
  if (!hasSupabaseConfig || !supabase) {
    const previousLength = localBlogPosts.length;
    localBlogPosts = localBlogPosts.filter((post) => String(post.id) !== String(postId));
    if (localBlogPosts.length === previousLength) {
      throw new Error("Không tìm thấy bài viết cần xóa.");
    }
    return { id: postId };
  }

  const { error } = await supabase.from("blog_posts").delete().eq("id", postId);
  if (error) {
    throw new Error(error.message);
  }
  return { id: postId };
}
