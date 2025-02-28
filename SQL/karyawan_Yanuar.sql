CREATE VIEW karyawan_Yanuar AS
SELECT
    ROW_NUMBER() OVER (ORDER BY nip) AS No,
    nip AS Nip,
    nama AS Nama,
    alamat AS Alamat,
    CASE 
        WHEN gend = 'L' THEN 'Laki-Laki'
        WHEN gend = 'P' THEN 'Perempuan'
        ELSE 'Tidak Diketahui'
    END AS Gend,
    DATE_FORMAT(tgl_lahir, '%d %M %Y') AS 'Tanggal Lahir'
FROM karyawan;