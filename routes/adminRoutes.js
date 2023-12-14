import express from 'express';
import { adminView, adminLoginView, adminLogin, getUsers, getUser, deleteUser, updateUser } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../server.js';

const router = express.Router();

// render admin panel main page
router.get('/main', protect, isAdmin, adminView);

// render admin login view
router.get('/login', adminLoginView);

// login admin
router.post('/login', adminLogin);

// get all users
router.get('/users', protect, isAdmin, getUsers);

// get specific user
router.post('/user', protect, isAdmin, getUser);

// update specific user
router.post('/user/edit', protect, updateUser)

// delete user
router.post('/user/delete', protect, deleteUser);

export default router;