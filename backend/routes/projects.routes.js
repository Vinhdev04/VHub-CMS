import { Router } from 'express';
import {
  getProjectDetailController,
  getProjectsController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
} from '../controller/projects.controller.js';

const router = Router();

router.get('/', getProjectsController);
router.get('/:id', getProjectDetailController);
router.post('/', createProjectController);
router.put('/:id', updateProjectController);
router.delete('/:id', deleteProjectController);

export default router;
