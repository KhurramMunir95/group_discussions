import express from 'express';
import { createGroup, createGroup_view, getGroups } from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGroups);

// render group create view
router.get('/create', createGroup_view);

// create a group
router.post('/create', protect, createGroup)

export default router;