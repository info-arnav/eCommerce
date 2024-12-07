const crypto = require("crypto");

async function decode(encryptedData, secret, ivHex) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secret,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = decode;
