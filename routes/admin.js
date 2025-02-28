const express = require('express')
const router = express.Router();
const { AdminRegister, AdminLogin } = require('../controller/adminController');
const { CreateKaryawan, getKaryawan, updateKaryawan, nonaktifkanKaryawan } = require('../controller/karyawanController');

router.post('/register', AdminRegister);
router.post('/login', AdminLogin);
router.post('/karyawan', CreateKaryawan);
router.get('/getkaryawan', getKaryawan);
router.put('/updatekaryawan/:nip', updateKaryawan);
router.patch('/nonaktifkaryawan/:nip', nonaktifkanKaryawan);

module.exports = router;