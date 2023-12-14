import mongoose from 'mongoose';
import Post from '../models/postModel.js';
import moment from 'moment';
import Group from '../models/groupModel.js';
import postLikes from '../models/post_likes_Model.js';

// posts view to get specific group posts
const postsView = async(req, res) => {
    const posts = await Post.aggregate([
        {
            $match: {group: new mongoose.Types.ObjectId(req.params.id)}
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: '$userDetails'
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $lookup: {
                from: 'postlikes',
                localField: '_id',
                foreignField: 'post',
                as: 'postLikes'
            }
        },
        {
            $project: {
                _id: 1,
                post: 1,
                user: '$userDetails._id',
                username: '$userDetails.username',
                profileImage: '$userDetails.profileImage',
                createdAt: 1,
                likes: { $size: '$postLikes' },
                postUser: '$postLikes.user',
                isLiked: {
                    $in: [req.user._id, '$postLikes.user']
                }
            }
        }
    ]);
    // res.send(posts);
    const groups = await Group.find();

    res.render('posts/posts', {posts, moment, groups});
}

const getAllPosts_api = async(req, res) => {
    const posts = await Post.aggregate([
        // selecting users who published the posts
        {
            /* in posts model user field name is user so localField is user
             and in users model it is _id */
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {   
            // getting user data from model as userDetails
            $unwind: '$userDetails'
        },
        {   
            // sorting in descending order so that the latest record will be on the top
            $sort: {
                createdAt: -1
            }
        },
        {   
             /* in posts model post field name is _id so localField is _id
             and in postlikes model it is post */
            $lookup: {
                from: 'postlikes',
                localField: '_id',
                foreignField: 'post',
                as: 'postLikes'
            }
        },
        {
            $project: {
                _id: 1,
                post: 1,
                user: '$userDetails._id',
                username: '$userDetails.username',
                profileImage: '$userDetails.profileImage',
                createdAt: 1,
                likes: { $size: '$postLikes' },
                postUser: '$postLikes.user',
                isLiked: {
                    $in: [req.user._id, '$postLikes.user'] //if a post is liked by the loggedin user
                }
            }
        }
    ]);
    res.json({ posts: posts })
}

const getAllPosts = async(req, res) => {
    const posts = await Post.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: '$userDetails'
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $lookup: {
                from: 'postlikes',
                localField: '_id',
                foreignField: 'post',
                as: 'postLikes'
            }
        },
        {
            $project: {
                _id: 1,
                post: 1,
                user: '$userDetails._id',
                username: '$userDetails.username',
                profileImage: '$userDetails.profileImage',
                createdAt: 1,
                likes: { $size: '$postLikes' },
                postUser: '$postLikes.user',
                isLiked: {
                    $in: [req.user._id, '$postLikes.user'] //if a post is liked by the loggedin user
                }
            }
        }
    ]);
    const groups = await Group.find();
    res.render('posts/posts', {posts, moment, groups});
}

// posts form view
const postForm = (req, res) => {
    res.render('posts/posts');
}

// create post
const createPost = async(req, res) => {
    const { post, group } = req.body;
    const form = await Post.create({
        user: req.user,
        // group: req.params.id,
        group: group,
        post: post
    })
    res.status(200).json({
        post: form
    })
    // res.redirect(`/user/posts/${req.params.id}`);
}

// update post
const updatePost = async(req, res) => {
    const { id } = req.body;
    const post = await Post.findByIdAndUpdate(id, req.body, {
        new: true
    })

    if(post) {
        res.status(200).json({message: 'post updated'});
    } else {
        res.status(403).json({error: 'post not updated!'});
    }
}

// like a post
const likePost = async(req, res) => {
    const { post, likes } = req.body;
    const user = await postLikes.findOne({user: req.user, post: post});
    if(!user) {
        await postLikes.create({
            user: req.user,
            post: post,
            likes: likes
        })
        res.json({ message: 'liked' });
    } else {
        await postLikes.deleteOne({user: req.user, post: post});
        res.json({ message: 'unliked' });
    }
}

// delete post
const removePost = async(req, res) => {
    const {id} = req.body;
    const post = await Post.findByIdAndDelete(id);
    // res.redirect('/user/posts');
    if(post) {
        res.status(200).json({message: 'deleted'});
    }
}

export {
    postsView,
    getAllPosts,
    getAllPosts_api,
    postForm,
    createPost,
    updatePost,
    likePost,
    removePost,
}