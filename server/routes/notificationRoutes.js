const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getNotifications);
router.patch("/read-all", verifyToken, markAllAsRead);
router.patch("/:id/read", verifyToken, markAsRead);

module.exports = router;
