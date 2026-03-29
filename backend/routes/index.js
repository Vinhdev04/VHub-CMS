import { Router } from 'express';
import projectsRouter  from './projects.routes.js';
import blogRouter      from './blog.routes.js';
import personnelRouter from './personnel.routes.js';
import authRouter      from './auth.routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/projects', projectsRouter);
router.use('/blog-posts', blogRouter);
router.use('/personnel', personnelRouter);

export default router;
