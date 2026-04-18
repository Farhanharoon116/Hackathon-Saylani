const express = require("express");
const router = express.Router();
const {
  getStats,
  getRequests,
  deleteRequest,
  getUsers,
  banUser,
} = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");

router.use(verifyToken, requireAdmin);

router.get("/stats", getStats);
router.get("/requests", getRequests);
router.delete("/requests/:id", deleteRequest);
router.get("/users", getUsers);
router.patch("/users/:id/ban", banUser);

module.exports = router;
