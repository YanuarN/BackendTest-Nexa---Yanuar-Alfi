const crypto = require("crypto");

const encrypt = (token) => {
  const key = crypto.createHash("sha256").update("nexatest").digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

const decrypt = (encrypt) => {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.AES_KEY, 'hex');
    
    const parts = encryptedToken.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

module.exports = { encrypt, decrypt };