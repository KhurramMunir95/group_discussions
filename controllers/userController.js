import formValidator  from 'express-validator';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
const { validationResult } = formValidator;
import multer from 'multer';

// multer file upload code
const storage = multer.diskStorage({
    destination: 'assets/uploads/images/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const maxSize = 1 * 1024 * 1024;
const upload = multer(
    { 
        storage: storage,
        limits: {
            fileSize: maxSize
        },
        fileFilter: (req, file, cb) => {
            if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false)
                return cb(new Error('file must be in png format!'));
            }
            const fileSize = parseInt(req.headers["content-length"])

            if(fileSize <=maxSize) {
                cb(null, true);
            } else {
                return cb(new Error('File size must not be greater than 1MB!'));
            }
        }
    }
).single('uploaded_file');

// render register view
const registerView = async(req, res) => {
    if(req.session.user) {
        res.redirect('profile')
    } else {
        res.render('auth/register');
    }
}

// register user
const createUser = async(req, res) => {
    const { username, email, password, profileImage, role } = req.body;

    let userDetails = {
        username,
        email,
        password
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const alert = errors.array();
        return res.render('auth/register', !errors.isEmpty() ? { alert, userDetails } : {message: 'User registered'})
    }
    await User.create({
        username,
        email,
        password,
        profileImage: '',
        role: 'user'
    })
    return res.render('auth/register', { message: 'User registered' })
}

// render login view
const loginView = async(req, res) => {
    if(req.session.user) {
        res.redirect('profile');
    } else {
        res.render('auth/login');
    }
}

// login user
const loginUser = async(req, res) => {
    const { email, password } = req.body;

    let error;

    if(!email || !password) {
        error = 'email and password required';
    } else {
        const user = await User.findOne({email})
    
        if(user && (await user.matchPassword(password))) {
            generateToken(req, user._id);
            res.redirect('profile');
        } else {
            error = 'invalid credentials';
        }
    }
    if(error) {
        res.render('auth/login', {error})
    }
}

// get loggedin user profile
const userProfile = async(req, res) => {
    res.render('user/profile', { user: req.user });
}

// render edit profile view of loggedin user
const editProfile = async(req, res) => {
    res.render('user/editProfile', { user: req.user });
}

// update user profile
const updateProfile = async(req, res) => {
    upload(req, res, async function (err) {
        if (err) {
          // A Multer error occurred when uploading.
          res.render('user/editProfile', {fileError: err})
        } 
        else {
            if(req.file == undefined) {
                res.render('user/editProfile', {fileError: 'Error: no file selected!'})
            } else {
                try {
                    const user = await User.findByIdAndUpdate(req.user.id, {
                        username: req.body.username,
                        email: req.body.email,
                        profileImage: req.file.filename
                    }, {
                        new: true
                    });
            
                    if(user) {
                        res.redirect('profile')
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    })
}

// logout user
const logout = async(req, res) => {
    // res.cookie('jwt', '', {
    //     httpOnly: true,
    //     expires: new Date(0)
    // });

    req.session.destroy();
    res.redirect('login')
}
 
export {
    registerView,
    createUser,
    loginView,
    loginUser,
    userProfile,
    editProfile,
    updateProfile,
    logout
}