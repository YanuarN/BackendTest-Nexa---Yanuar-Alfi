const jwt = require('jsonwebtoken');

const generateToken = (admin, res) => {
    const token = jwt.sign(
        {
            nama: admin.usernama,
            password: admin.password
        },
        process.env.JWT_SECRET,
        { expiresIn: '10d'}
    );

    return token;
}

module.exports = { generateToken };