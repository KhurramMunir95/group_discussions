import express from 'express'
import { createPost, getAllPosts_api, likePost, postForm, postsView, removePost, updatePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// get Posts
router.get('/', postsView);

// get all posts with api
router.get('/posts', protect, getAllPosts_api);

// get post form
// router.get('/create', postForm);

// create post
router.post('/create', protect, createPost);

// update post
router.post('/update', protect, updatePost);

// like a post
router.post('/like', protect, likePost);

// delete post
router.post('/delete', protect, removePost);

export default router;