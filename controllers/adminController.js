import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
// render admin view
const adminView = async(req, res) => {
    // checking if user role is admin and not checking if user session is present because it's protected route
    res.render('admin/index', {user: req.user});
}

// render admin login view
const adminLoginView = async(req, res) => {
    // checking if user session is present (because this url has no middleware) and user role is admin
    if(req.session.user && req.session.user.role === 'admin') {
        res.redirect('main')
    }
    res.render('admin/auth/login');
}

// login admin
const adminLogin = async(req, res) => {
    const { email, password } = req.body;
    let error;
    if(!email || !password) {
        error = 'email and password required';
    } else {
        const user = await User.findOne({email});
        if(user && (await user.matchPassword(password)) && user.role === 'admin') {
            generateToken(req, user._id);
            res.redirect('main');
        } else {
            error = 'Invalid credentials';
        }
    }

    if(error) {
        res.render('admin/auth/login', {error})
    }
}

// get all users
const getUsers = async(req, res) => {
    const users = await User.find();
    res.render('admin/users/users', {user: req.user, users})
}

// get specific user detail
const getUser = async(req, res) => {
    const user = await User.findById(req.body.user_id);
    res.render('admin/users/edit', {user})
    // if(user) {
    // } else {
    //     res.redirect('/admin/users');
    // }
}

const updateUser = async(req, res) => {
    const user = await User.findByIdAndUpdate(req.body.user_id, {
        username: req.body.username,
        email: req.body.email
    },{
        new: true
    })
    // res.render('admin/users/edit', {user})

    if(user) {
        res.redirect('/admin/users')
    }
}

// delete user
const deleteUser = async(req, res) => {
    await User.findByIdAndDelete(req.body.user_id);
    // user.remove();
    res.redirect('/admin/users')
}

export {
    adminView,
    adminLoginView,
    adminLogin,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}