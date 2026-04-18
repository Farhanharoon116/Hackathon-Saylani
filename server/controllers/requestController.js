const Request = require("../models/Request");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { askGemini } = require("../utils/gemini");

const getRequests = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.urgency) filter.urgency = req.query.urgency;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.skills) {
      filter.tags = { $in: req.query.skills.split(",") };
    }
    if (req.query.location) {
      filter["requester.location"] = req.query.location;
    }

    const requests = await Request.find(filter)
      .populate("requester", "-password")
      .populate("helpers", "-password")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("requester", "-password")
      .populate("helpers", "-password");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createRequest = async (req, res) => {
  try {
    const { title, description, category, urgency, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let aiSummary = "";
    try {
      const prompt = `Summarize this help request in 1-2 sentences: Title: "${title}", Description: "${description}"`;
      const result = await askGemini(prompt);
      if (result) aiSummary = result;
    } catch (err) {
      // Gemini failed, leave aiSummary empty
    }

    const request = await Request.create({
      title,
      description,
      category: category || "Other",
      urgency: urgency || "Medium",
      tags: tags || [],
      requester: req.user._id,
      aiSummary,
    });

    const populated = await Request.findById(request._id)
      .populate("requester", "-password")
      .populate("helpers", "-password");

    res.status(201).json({ request: populated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const solveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "Solved";
    await request.save();

    // Reward helpers
    for (const helperId of request.helpers) {
      const helper = await User.findById(helperId);
      if (!helper) continue;

      helper.trustScore += 10;
      helper.contributions += 1;

      if (helper.trustScore >= 50 && !helper.badges.includes("Top Mentor")) {
        helper.badges.push("Top Mentor");
      }
      if (helper.contributions >= 5 && !helper.badges.includes("Fast Responder")) {
        helper.badges.push("Fast Responder");
      }

      await helper.save();

      await Notification.create({
        user: helperId,
        type: "Reputation",
        message: `The request "${request.title}" has been marked as solved. You earned +10 trust score!`,
      });
    }

    const populated = await Request.findById(request._id)
      .populate("requester", "-password")
      .populate("helpers", "-password");

    res.json({ request: populated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const helpRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const userId = req.user._id.toString();
    const alreadyHelping = request.helpers.some(
      (h) => h.toString() === userId
    );

    if (alreadyHelping) {
      return res.status(400).json({ message: "You are already helping with this request" });
    }

    request.helpers.push(req.user._id);
    await request.save();

    await Notification.create({
      user: request.requester,
      type: "Match",
      message: `${req.user.name} has offered to help with your request "${request.title}"`,
    });

    const populated = await Request.findById(request._id)
      .populate("requester", "-password")
      .populate("helpers", "-password");

    res.json({ request: populated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getRequests, getRequestById, createRequest, solveRequest, helpRequest };
