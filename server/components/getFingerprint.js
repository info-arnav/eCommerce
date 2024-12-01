const crypto = require("crypto");

async function getFingerprint(req) {
  const fingerprint_data = { ip: req.socket.remoteAddress };
  const hash = await crypto.createHash("sha256");
  hash.update(JSON.stringify(fingerprint_data));
  return await hash.digest("hex");
}

module.exports = getFingerprint;
