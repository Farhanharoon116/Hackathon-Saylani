const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "Other" },
  urgency: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  tags: [String],
  status: {
    type: String,
    enum: ["Open", "Solved"],
    default: "Open",
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  aiSummary: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
