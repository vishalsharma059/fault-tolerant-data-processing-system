// services/aggregator.js
const Aggregate = require("../models/Aggregate");

const updateAggregate = async (event) => {
  const ts =
    event.timestamp instanceof Date
      ? event.timestamp
      : new Date(event.timestamp);
  const date = ts.toISOString().split("T")[0];

  await Aggregate.updateOne(
    {
      clientId: event.clientId,
      metric: event.metric,
      date,
    },
    {
      $inc: {
        totalAmount: event.amount,
        eventCount: 1,
      },
    },
    { upsert: true }
  );
};

module.exports = updateAggregate;
