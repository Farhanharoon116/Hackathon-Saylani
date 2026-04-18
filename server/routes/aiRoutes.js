const express = require("express");
const router = express.Router();
const { suggest, onboarding, insights } = require("../controllers/aiController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/suggest", verifyToken, suggest);
router.post("/onboarding", verifyToken, onboarding);
router.get("/insights", verifyToken, insights);

module.exports = router;
