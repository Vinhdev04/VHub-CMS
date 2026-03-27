import { Router } from "express";
import {
  createBlogPostController,
  deleteBlogPostController,
  getBlogPostsController,
  updateBlogPostController,
} from "./blog.controller.js";

const blogRouter = Router();

blogRouter.get("/", getBlogPostsController);
blogRouter.post("/", createBlogPostController);
blogRouter.put("/:id", updateBlogPostController);
blogRouter.delete("/:id", deleteBlogPostController);

export default blogRouter;
