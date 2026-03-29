import { Router } from 'express';
import {
  getPersonnelController,
  createPersonnelItemController,
  updatePersonnelItemController,
  deletePersonnelItemController,
} from '../controller/personnel.controller.js';

const router = Router();

router.get('/', getPersonnelController);
router.post('/', createPersonnelItemController);
router.put('/:id', updatePersonnelItemController);
router.delete('/:id', deletePersonnelItemController);

export default router;
