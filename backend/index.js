// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");          // ✅ ADD THIS
const connectDB = require("./config/db");

const ingestRoutes = require("./routes/ingest");
const aggregateRoutes = require("./routes/aggregate");

const app = express();

// ✅ Enable CORS (allow frontend requests)
app.use(cors());

// ✅ Parse JSON bodies
app.use(express.json());

// DB connection
connectDB();

// Routes
app.use("/ingest", ingestRoutes);
app.use("/aggregates", aggregateRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
