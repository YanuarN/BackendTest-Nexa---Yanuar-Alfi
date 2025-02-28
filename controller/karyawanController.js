const { Karyawan } = require('../models');
const { Op } = require('sequelize');
const { authenticateAdminToken, upload } = require('../middleware/middleware');
const { convertImage } = require('../utils/convert');

const uploadMiddleware = upload.single('photo');

const CreateKaryawan = async (req, res) => {
    try {
        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Error uploading file',
                    error: err.message
                });
            }

            authenticateAdminToken(req, res, async () => {
                const { nama, alamat, gend, tgl_lahir, status, insert_by } = req.body;
                
                if (!nama || !alamat || !gend || !tgl_lahir || !status || !insert_by) {
                    return res.status(400).json({
                        success: false,
                        message: 'Mohon lengkapi semua field'
                    });
                }

                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        message: 'Photo harus diupload'
                    });
                }
                
                const photoBase64 = convertImage(req.file.buffer);
                if (!photoBase64) {
                    return res.status(500).json({
                        success: false,
                        message: 'Gagal mengkonversi photo'
                    });
                }
  
                const currentYear = new Date().getFullYear();
                
                const latestEmployee = await Karyawan.findOne({
                    where: {
                        nip: {
                            [Op.like]: `${currentYear}%`
                        }
                    },
                    order: [['nip', 'DESC']]
                });
                
                let counter = 1;
                if (latestEmployee) {
                    const latestCounter = parseInt(latestEmployee.nip.substring(4));
                    counter = latestCounter + 1;
                }
                
                const nip = `${currentYear}${String(counter).padStart(4, '0')}`;
                
                const photoData = `data:${req.file.mimetype};base64,${photoBase64}`;
                
                const newKaryawan = await Karyawan.create({
                    nip,
                    nama,
                    alamat,
                    gend,
                    photo: photoData,
                    tgl_lahir,
                    status,
                    insert_at: new Date().now,
                    insert_by,
                    id: '1'
                });
                
                res.status(201).json({
                    success: true,
                    message: 'Karyawan berhasil ditambahkan',
                    data: newKaryawan
                    });
                });
            });
    } catch (error) {
        console.error('Error creating karyawan:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

const getKaryawan = async (req, res) => {
    try {
        authenticateAdminToken(req, res, async () => {
            let { keyword = "", start = "0", count = "10" } = req.query;

            keyword = keyword.replace(/[^\w\s]/gi, ''); 
            start = parseInt(start);
            count = parseInt(count);

            // Validasi angka
            if (isNaN(start) || isNaN(count) || start < 0 || count <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Start dan count harus berupa angka positif"
                });
            }

            // Query database dengan filter nama & pagination
            const whereClause = {
                status: { [Op.ne]: 9 } // Hanya menampilkan karyawan aktif
            };

            // Jika keyword tidak kosong, tambahkan filter nama
            if (keyword) {
                whereClause.nama = { [Op.like]: `%${keyword}%` };
            }

            const karyawanList = await Karyawan.findAndCountAll({
                where: whereClause,
                offset: start,
                limit: count,
                order: [['nama', 'ASC']] // Urutkan berdasarkan nama
            });

            // Cek apakah data ditemukan
            if (karyawanList.count === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Data tidak ditemukan"
                });
            }

            // Kirimkan hasil
            res.status(200).json({
                success: true,
                message: "Daftar karyawan ditemukan",
                data: karyawanList.rows,
                total: karyawanList.count
            });
        });
    } catch (error) {
        console.error('Error getting karyawan:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const updateKaryawan = async (req, res) => {
    try {
        authenticateAdminToken(req, res, async () => {
            const { nip, nama, alamat, gend, tgl_lahir, status, insert_by } = req.body;

            if (!nip || !nama || !alamat || !gend || !tgl_lahir || !status || !insert_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Mohon lengkapi semua field'
                });
            }

            // Cek apakah karyawan dengan NIP tersebut ada
            const existingKaryawan = await Karyawan.findOne({ where: { nip } });
            if (!existingKaryawan) {
                return res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
            }

            // Update karyawan tanpa mengubah photo
            const [updated] = await Karyawan.update({
                nama,
                alamat,
                gend,
                tgl_lahir,
                status,
                update_at: new Date(),
                insert_by,
                id: '1'
            }, {
                where: { nip }
            });

            if (!updated) {
                return res.status(400).json({
                    success: false,
                    message: 'Gagal memperbarui karyawan'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Karyawan berhasil diperbarui'
            });
        });
    } catch (error) {
        console.error('Error updating karyawan:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const nonaktifkanKaryawan = async (req, res) => {
    try {
        authenticateAdminToken(req, res, async () => {
            const { nip } = req.params;

            if (!nip) {
                return res.status(400).json({ success: false, message: "NIP harus diisi" });
            }

            const [updated] = await Karyawan.update(
                { status: 9 },
                { where: { nip } }
            );

            if (!updated) {
                return res.status(404).json({ success: false, message: "Karyawan tidak ditemukan" });
            }

            res.status(200).json({ success: true, message: "Karyawan berhasil dinonaktifkan" });
        });
    } catch (error) {
        console.error('Error deactivating karyawan:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
};

module.exports = { CreateKaryawan, getKaryawan, updateKaryawan, nonaktifkanKaryawan };