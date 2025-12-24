// models/RawEvent.js
const mongoose = require("mongoose");

const RawEventSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  source: { type: String },
  payload: { type: Object }, // raw JSON
  status: {
    type: String,
    enum: ["RECEIVED", "PROCESSED", "FAILED"],
    default: "RECEIVED"
  },
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RawEvent", RawEventSchema);
