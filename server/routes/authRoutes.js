const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { message: "Too many requests, please try again later" },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", verifyToken, getMe);

module.exports = router;
