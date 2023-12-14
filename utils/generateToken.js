import jwt from 'jsonwebtoken';

const generateToken = (req, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    // res.cookie('jwt', token, {
    //     httpOnly: true,
    //     sameSite: true,
    //     secure: false,
    //     maxAge: 30 * 24 * 60 * 60 * 1000
    // })
    req.session.token = token;

    return token;
}

export default generateToken;