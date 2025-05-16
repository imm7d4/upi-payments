const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  cashback: Number,    // if you have cashback
  txnRef: { type: String, unique: true, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
