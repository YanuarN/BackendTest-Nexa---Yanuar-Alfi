const bcryptjs = require('bcryptjs');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { generateTokenAndCookie } = require('../utils/generateToken');


const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'nama', 'email', 'tanggal_daftar'],
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil daftar pengguna.' });
    }
};

const Register = async (req, res) => {
    try {
        const { nama, email, password } = req.body;
        if (!nama || !email || !password) {
            return res.status(400).json({ message: 'Semua field wajib diisi!' });
        }
        const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = await User.create({
            nama,
            email,
            password: hashedPassword,
            tanggal_daftar: new Date(),
        });
        newUser.password = undefined;
        return res.status(201).json({
            message: 'Registrasi berhasil!',
            data: newUser,
        });
    } catch (error) {
        console.error(error, 'error register');
        return res.status(500).json({
            message: 'Terjadi kesalahan saat registrasi.',
            error: error.message,
        });
    }
};

const login = async (req,res) => {
    try {
        const { email, password } = req.body;
    
        // Validasi input
        if (!email || !password) {
          return res.status(400).json({
            status: 'error',
            message: 'Email dan password harus diisi'
          });
        }
        
        // Cari user berdasarkan email
        const user = await User.findOne({ 
          where: { email },
          raw: true // Mendapatkan plain object
        });
    
        // Jika user tidak ditemukan
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'User tidak ditemukan'
          });
        }
    
        // Verifikasi password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
    
        // Jika password salah
        if (!isPasswordValid) {
          return res.status(401).json({
            status: 'error',
            message: 'Password salah'
          });
        }

        const token = generateTokenAndCookie(user, res);
    
        // Kirim respons berhasil
        res.status(200).json({
          status: 'success',
          message: 'Login berhasil',
          data: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            token: token
          }
        });
    
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
          error: error.message
        });
      }
};

const Logout = async (req, res) => {
    try {
        // Hapus cookie token
        res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'development',
          sameSite: 'strict'
        });
    
        res.status(200).json({
          status: 'success',
          message: 'Logout berhasil'
        });
      } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
          error: error.message
        });
      }
};

module.exports = { Register, getUsers, login, Logout }