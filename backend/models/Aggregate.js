// models/Aggregate.js
const mongoose = require("mongoose");

const AggregateSchema = new mongoose.Schema({
  clientId: String,
  metric: String,
  date: String, // YYYY-MM-DD
  totalAmount: Number,
  eventCount: Number
});

AggregateSchema.index(
  { clientId: 1, metric: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Aggregate", AggregateSchema);
