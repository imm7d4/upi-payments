const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  vpa: { type: String, unique: true },
  balance: { type: Number, default: 1000 },
  pinHash: { type: String },
   favorites: {
    type: [String],  // array of VPAs
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
