const bcrypt = require('bcrypt'); 
const moment = require('moment');
const { Admin } = require('../models');
const { admin_token } = require('../models');
const { encrypt } = require('../utils/encrypt');
const { generateToken } = require('../utils/generateToken');

const AdminRegister = async (req, res) => {
    try {
        const { username, password, note } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Mohon lengkapi semua field'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({ 
            username, 
            password: hashedPassword, 
            note 
        });

        const token = generateToken(newAdmin);

        const encryptedToken = encrypt(token);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 10);
        
        await admin_token.create({
            id_admin: newAdmin.id,
            token: encryptedToken,
            expiresAt: expiryDate
        });

        const adminData = newAdmin.toJSON();
        delete adminData.password;
        
        res.status(201).json({
            success: true,
            message: 'Registrasi admin berhasil',
            data: {
                admin: adminData,
                token
            }
        });

    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

const AdminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Mohon lengkapi semua field'
            });
        }

        const admin = await Admin.findOne({ 
            where: { username },
            attributes: ['username', 'password']
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin tidak ditemukan'
            });
        }

        const convertBinaryToString = (binaryData) => {
            if (Buffer.isBuffer(binaryData)) {
                return binaryData.toString("utf-8");
            }
            return binaryData; 
        };
        let dbPassword = convertBinaryToString(admin.password);
        const isPasswordMatch = await bcrypt.compare(password, dbPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Password salah'
            });
        }

        const token = generateToken(admin);
        const encryptedToken = encrypt(token);
        const expiryDate = new Date(Date.now());
        expiryDate.setHours(expiryDate.getHours() + 7);

        await admin_token.create({
            id_admin: "35",
            token: encryptedToken,
            expiresAt: expiryDate
        });

        const adminData = admin.toJSON();
        delete adminData.password;

        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                admin: adminData,
                token,
                encryptedToken
            }
        });

    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { AdminRegister, AdminLogin };