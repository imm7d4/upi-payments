const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { logAction } = require("../utils/logger");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/auth");
const SALT_ROUNDS = 10;

// Public: Register user
router.post("/register", async (req, res) => {
  const { name, vpa } = req.body;
  try {
    const exists = await User.findOne({ vpa });
    if (exists) return res.status(400).json({ error: "VPA already exists" });

    const user = new User({ name, vpa });
    await user.save();
    await logAction(vpa, "USER_REGISTERED", { name });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Public: Set PIN
router.post("/set-pin", async (req, res) => {
  const { vpa, pin } = req.body;
  if (!vpa || !pin) return res.status(400).json({ error: "VPA and PIN are required" });

  const user = await User.findOne({ vpa });
  if (!user) return res.status(404).json({ error: "User not found" });

  const hash = await bcrypt.hash(pin, SALT_ROUNDS);
  user.pinHash = hash;
  await user.save();
  await logAction(vpa, "PIN_SET", {});
  res.json({ message: "PIN set successfully" });
});

// Protected: Update PIN
router.patch("/update-pin", auth, async (req, res) => {
  const { oldPin, newPin } = req.body;
  const user = await User.findById(req.user._id);

  if (!user || !oldPin || !newPin) {
    return res.status(400).json({ error: "Old and new PIN are required" });
  }

  const isMatch = await bcrypt.compare(oldPin, user.pinHash);
  if (!isMatch) return res.status(401).json({ error: "Incorrect old PIN" });

  const newHash = await bcrypt.hash(newPin, SALT_ROUNDS);
  user.pinHash = newHash;
  await user.save();
  await logAction(user.vpa, "PIN_UPDATED", {});
  res.json({ message: "PIN updated successfully" });
});

// Protected: Update VPA
router.patch("/update-vpa", auth, async (req, res) => {
  const { newVpa } = req.body;
  const user = await User.findById(req.user._id);

  if (!newVpa) return res.status(400).json({ error: "New VPA is required" });

  const existing = await User.findOne({ vpa: newVpa });
  if (existing) return res.status(400).json({ error: "New VPA is already taken" });

  const oldVpa = user.vpa;
  user.vpa = newVpa;
  await user.save();
  await logAction(oldVpa, "VPA_UPDATED", { newVpa });
  res.json({ message: "VPA updated successfully", newVpa });
});

// GET: User Balance
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ vpa: req.user.vpa });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ balance: user.balance });
  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Protected: Get all users 
router.get("/", auth, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get favorites
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// Add a favorite VPA
router.post("/favorites", authMiddleware, async (req, res) => {
  const { vpa } = req.body;
  if (!vpa) return res.status(400).json({ error: "VPA is required" });

  try {
    const user = await User.findById(req.user._id);
    if (!user.favorites.includes(vpa)) {
      user.favorites.push(vpa);
      await user.save();
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Remove a favorite VPA
router.delete("/favorites/:vpa", authMiddleware, async (req, res) => {
  const { vpa } = req.params;

  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(fav => fav !== vpa);
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

module.exports = router;
