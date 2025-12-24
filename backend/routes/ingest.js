// routes/ingest.js
const express = require("express");
const crypto = require("crypto");

const RawEvent = require("../models/RawEvent");
const Event = require("../models/Event");

const normalizeEvent = require("../services/normalizer");
const generateFingerprint = require("../services/fingerprint");
const updateAggregate = require("../services/aggregator");

const router = express.Router();

router.post("/", async (req, res) => {
  const requestId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : require("uuid").v4();
  let rawEvent; // ✅ accessible in catch

  try {
    const body = req.body;

    // Guard: missing or empty JSON body
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      rawEvent = await RawEvent.create({
        requestId,
        source: null,
        payload: body ?? null,
        status: "FAILED",
      });
      console.error("Ingest error: missing or empty request body", {
        headers: req.headers,
        body,
      });
      return res.status(400).json({ message: "Missing or empty JSON body" });
    }

    // 1️⃣ Save raw event
    rawEvent = await RawEvent.create({
      requestId,
      source: body.source,
      payload: body,
    });

    // 2️⃣ Normalize
    const normalized = normalizeEvent(req.body);
    if (!normalized) {
      await RawEvent.findByIdAndUpdate(rawEvent._id, { status: "FAILED" });
      return res.status(400).json({ message: "Invalid event format" });
    }

    // 3️⃣ Fingerprint
    const fingerprint = generateFingerprint(normalized);

    // 4️⃣ Canonical insert (idempotent)
    try {
      const event = await Event.create({
        ...normalized,
        fingerprint,
      });

      // 5️⃣ Aggregate
      await updateAggregate(event);
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(200)
          .json({ message: "Duplicate event ignored (idempotent)" });
      }
      throw err;
    }

    // 6️⃣ Mark processed
    await RawEvent.findByIdAndUpdate(rawEvent._id, { status: "PROCESSED" });

    res.status(201).json({ message: "Event processed successfully" });
  } catch (error) {
    console.error("Ingest error:", error.message);

    if (rawEvent?._id) {
      await RawEvent.findByIdAndUpdate(rawEvent._id, { status: "FAILED" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
