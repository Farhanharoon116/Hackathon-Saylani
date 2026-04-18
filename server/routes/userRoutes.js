const express = require("express");
const router = express.Router();
const {
  getLeaderboard,
  getUserById,
  updateProfile,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/leaderboard", getLeaderboard);
router.get("/:id", getUserById);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
