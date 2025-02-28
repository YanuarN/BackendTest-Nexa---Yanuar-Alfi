DELIMITER $$

CREATE PROCEDURE sp_add_kary_Yanuar(
    IN p_nip VARCHAR(20),
    IN p_nama VARCHAR(100),
    IN p_alamat TEXT,
    IN p_gender ENUM('L', 'P'),
    IN p_tanggal_lahir DATE
)
BEGIN
    DECLARE v_result VARCHAR(100);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET v_result = 'Gagal: NIP sudah ';
        INSERT INTO log_trx_api (action, result, created_at) 
        VALUES ('sp_add_kary_Yanuar', v_result, NOW());
        SELECT v_result AS result;
    END;

    START TRANSACTION;

    IF EXISTS (SELECT 1 FROM karyawan WHERE nip = p_nip) THEN
        SET v_result = 'Gagal: NIP sudah ada';
        INSERT INTO log_trx_api (action, result, created_at) 
        VALUES ('sp_add_kary_nama_anda', v_result, NOW());
        SELECT v_result AS result;
        ROLLBACK;
    ELSE
        INSERT INTO karyawan (nip, nama, alamat, gend, tgl_lahir, status, insert_at, insert_by)
        VALUES (p_nip, p_nama, p_alamat, p_gend, p_tgl_lahir, p_status, NOW(), p_insert_by);

        SET v_result = 'Berhasil: Data karyawan ditambahkan';
        INSERT INTO log_trx_api (action, result, created_at) 
        VALUES ('sp_add_kary_nama_anda', v_result, NOW());

                COMMIT;
        SELECT v_result AS result;
    END IF;
END$$

DELIMITER ;