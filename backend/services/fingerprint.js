// services/fingerprint.js
const crypto = require("crypto");

const generateFingerprint = (event) => {
  if (!event?.timestamp) throw new Error("Invalid timestamp for fingerprint");
  const ts =
    event.timestamp instanceof Date
      ? event.timestamp.toISOString()
      : new Date(event.timestamp).toISOString();
  const key = `${event.clientId}-${event.metric}-${event.amount}-${ts}`;
  return crypto.createHash("sha256").update(key).digest("hex");
};

module.exports = generateFingerprint;
