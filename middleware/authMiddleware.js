import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
    // const token = req.cookies.jwt;
    const token = req.session.token;
        if(token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.userId).select('-password');
                req.session.user = req.user;
                next();
            } catch (error) {
                res.status(401);
                console.log('Not authorized, Invalid token');
                res.redirect('login')
            }
            // next();
        } else {
            res.status(401);
            console.log('Not authorized, No token');
            res.redirect('login')
        }
}

export {protect};