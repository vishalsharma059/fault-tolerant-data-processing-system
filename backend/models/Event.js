// models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  clientId: String,
  metric: String,
  amount: Number,
  timestamp: Date,
  fingerprint: { type: String, unique: true }
});

// 🔐 Enforce idempotency
EventSchema.index({ fingerprint: 1 }, { unique: true });

module.exports = mongoose.model("Event", EventSchema);
