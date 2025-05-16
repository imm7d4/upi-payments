// middleware/auth.js

const jwt = require("jsonwebtoken");

// Use env var, with a fallback
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) 
    return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  if (!token) 
    return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;   // payload should include { vpa }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
