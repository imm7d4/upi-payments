const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret"; // Use env var in real apps

// Login
router.post("/login", async (req, res) => {
  const { vpa, pin } = req.body;
  const user = await User.findOne({ vpa });
  if (!user) return res.status(400).json({ error: "User not found" });

  if (!user.pinHash) return res.status(400).json({ error: "PIN not set" });

  const isValid = await bcrypt.compare(pin, user.pinHash);
  if (!isValid) return res.status(400).json({ error: "Invalid PIN" });

  const token = jwt.sign({ vpa }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, vpa, name: user.name });
});


module.exports = router;

