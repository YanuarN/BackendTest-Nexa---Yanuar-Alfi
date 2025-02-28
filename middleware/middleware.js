const jwt = require('jsonwebtoken');
const multer = require('multer');


const authenticateAdminToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const clientToken = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

        if (!clientToken) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak ditemukan'
            });
        }

        // Verifikasi token menggunakan JWT
        jwt.verify(clientToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Token tidak valid atau sudah kadaluarsa'
                });
            }

            // Jika token valid, simpan data user ke request
            req.user = user;
            next(); // Lanjutkan ke endpoint berikutnya
        });

    } catch (error) {
        console.error('Error in authenticateAdminToken middleware:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = { authenticateAdminToken, upload };