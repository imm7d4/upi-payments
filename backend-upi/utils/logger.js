const AuditLog = require("../models/AuditLog");

async function logAction(vpa, action, metadata = {}) {
  try {
    const log = new AuditLog({ vpa, action, metadata });
    await log.save();
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
}

module.exports = { logAction };
