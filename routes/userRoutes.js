import express from 'express';
import User from '../models/userModel.js';
import formValidator  from 'express-validator';
import Group from '../models/groupModel.js';
import { 
    createUser, 
    editProfile, 
    loginUser, 
    loginView, 
    logout, 
    registerView, 
    updateProfile, 
    userProfile 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createPost, getAllPosts, postForm, postsView } from '../controllers/postController.js';

const { check } = formValidator;

const router = express.Router();

// render register view
router.get('/register', registerView)

// render login view
router.get('/login', loginView)

// register user
router.post('/register', 
    check('username')
    .trim()
    .isLength({ min:3 })
    .withMessage('Username must be at least 3 characters long'),

    check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter valid email address')
    .custom(async(value) => {
        const user = await User.findOne({ email: value })
        if(user) {
            throw new Error('Email already exists');
        }
        return true
    }),

    check('password')
    .trim()
    .custom(async(value) => {
        const passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if(!await RegExp(passwordRegex).test(value)) {
            throw new Error('Password should be min 8 chars with atleast 1 special, 1 digit and 1 uppercase');
        }
        return true;
    }),
    createUser)

// login user
router.post('/login', loginUser);

// logout user
router.get('/logout', logout)

// === user ===
router.get('/profile', protect, userProfile)

// edit profile
router.get('/editProfile', protect, editProfile)

// update profile
router.post('/profile', protect, updateProfile);

// render discussions view and show disucssion groups
router.get('/posts/:id', protect, postsView);

// get all posts
router.get('/posts', protect, getAllPosts);

// create a new post route
router.post('/posts/:id', protect, createPost);

export default router;