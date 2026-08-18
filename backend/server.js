
const express = require("express");
const cors = require("cors");
const expensesRouter = require("./routes/expenses");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint - useful for Uptime Kuma / CI-CD smoke tests
app.get("/health", (req, res) => {
  res.json({ status: "broken", version: process.env.APP_VERSION || "v4.2" });
});

app.use("/api/expenses", expensesRouter);

app.listen(PORT, () => {
  console.log(`Expense Tracker backend running on port ${PORT}`);
  console.log(`Version: ${process.env.APP_VERSION || "v1"}`);
});
