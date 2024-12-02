const jwt = require('jsonwebtoken');

const generateTokenAndCookie = (user, res) => {
    const token = jwt.sign(
        {
            nama: user.nama,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '10d'}
    );

    res.cookie('token', token, {
        maxAge: 10 * 24 * 60 * 60 * 1000, 
        httponly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
}

module.exports = { generateTokenAndCookie };