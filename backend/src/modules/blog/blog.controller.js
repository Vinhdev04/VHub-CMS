import { successResponse } from "../../shared/utils/apiResponse.js";
import {
  createBlogPostItem,
  deleteBlogPostItem,
  getBlogPostList,
  updateBlogPostItem,
} from "./blog.service.js";

export async function getBlogPostsController(req, res, next) {
  try {
    const posts = await getBlogPostList();
    return res.json(successResponse(posts, "Lấy danh sách bài viết thành công"));
  } catch (error) {
    return next(error);
  }
}

export async function createBlogPostController(req, res, next) {
  try {
    const post = await createBlogPostItem(req.body);
    return res.status(201).json(successResponse(post, "Tạo bài viết thành công"));
  } catch (error) {
    return next(error);
  }
}

export async function updateBlogPostController(req, res, next) {
  try {
    const post = await updateBlogPostItem(req.params.id, req.body);
    return res.json(successResponse(post, "Cập nhật bài viết thành công"));
  } catch (error) {
    return next(error);
  }
}

export async function deleteBlogPostController(req, res, next) {
  try {
    const result = await deleteBlogPostItem(req.params.id);
    return res.json(successResponse(result, "Xóa bài viết thành công"));
  } catch (error) {
    return next(error);
  }
}
