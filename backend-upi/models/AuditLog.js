const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  vpa: String,
  action: String,
  metadata: Object,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
