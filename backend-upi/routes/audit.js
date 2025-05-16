const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");

router.get("/:vpa", async (req, res) => {
  const { vpa } = req.params;
  const logs = await AuditLog.find({ vpa }).sort({ timestamp: -1 });
  res.json(logs);
});

module.exports = router;
