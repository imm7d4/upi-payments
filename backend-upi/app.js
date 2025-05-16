const cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));
const userRoutes = require("./routes/user");
const transactionRoutes = require("./routes/transaction");
const auditRoutes = require("./routes/audit");
const authRoutes = require("./routes/auth");

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
