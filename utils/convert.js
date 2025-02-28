const convertImage = (fileBuffer) => {
    try {
        const base64 = fileBuffer.toString('base64');
        return base64.substring(0, 128); 
    } catch (error) {
        console.error('Gagal mengubah gambar ke base64:', error);
        return null;
    }
};

module.exports = { convertImage };