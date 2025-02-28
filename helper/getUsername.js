require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");

const getUsernameFromJWT = (token) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            throw new Error("Secret key is not defined in environment variables");
        }

        const decoded = jwt.verify(token, secretKey);
        return decoded.username; // Sesuaikan dengan struktur payload JWT
    } catch (error) {
        console.error("Invalid token:", error.message);
        return null; // Jika token tidak valid
    }
};

module.exports = { getUsernameFromJWT };