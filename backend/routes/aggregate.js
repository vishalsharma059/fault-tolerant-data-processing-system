// routes/aggregate.js
const express = require("express");
const Aggregate = require("../models/Aggregate");

const router = express.Router();

/**
 * GET /aggregates
 * Optional query params:
 *  - clientId
 *  - metric
 *  - from (YYYY-MM-DD)
 *  - to   (YYYY-MM-DD)
 */
router.get("/", async (req, res) => {
  try {
    const { clientId, metric, from, to } = req.query;

    const query = {};

    if (clientId) query.clientId = clientId;
    if (metric) query.metric = metric;

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to) query.date.$lte = to;
    }

    const aggregates = await Aggregate.find(query).sort({ date: 1 });

    res.json({
      count: aggregates.length,
      data: aggregates,
    });
  } catch (error) {
    console.error("Aggregate fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
