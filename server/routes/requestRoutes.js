const express = require("express");
const router = express.Router();
const {
  getRequests,
  getRequestById,
  createRequest,
  solveRequest,
  helpRequest,
} = require("../controllers/requestController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", getRequests);
router.get("/:id", getRequestById);
router.post("/", verifyToken, createRequest);
router.patch("/:id/solve", verifyToken, solveRequest);
router.post("/:id/help", verifyToken, helpRequest);

module.exports = router;
