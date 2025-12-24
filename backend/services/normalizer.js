// services/normalizer.js
const parseDate = (value) => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

const normalizeEvent = (raw) => {
  try {
    const timestamp = parseDate(raw.payload?.timestamp);
    const amount = Number(raw.payload?.amount);

    // Reject events with invalid timestamp or non-numeric amount
    if (!timestamp || !Number.isFinite(amount)) {
      return null;
    }

    return {
      clientId: raw.source,
      metric: raw.payload?.metric || null,
      amount,
      timestamp,
    };
  } catch {
    return null;
  }
};

module.exports = normalizeEvent;
