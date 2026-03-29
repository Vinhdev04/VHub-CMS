import { Router } from 'express';
import {
  getBlogPostDetailController,
  getBlogPostsController,
  createBlogPostController,
  updateBlogPostController,
  deleteBlogPostController,
} from '../controller/blog.controller.js';

const router = Router();

router.get('/', getBlogPostsController);
router.get('/:id', getBlogPostDetailController);
router.post('/', createBlogPostController);
router.put('/:id', updateBlogPostController);
router.delete('/:id', deleteBlogPostController);

export default router;
