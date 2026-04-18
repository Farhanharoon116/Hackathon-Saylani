const User = require("../models/User");
const Request = require("../models/Request");

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRequests = await Request.countDocuments();
    const solvedRequests = await Request.countDocuments({ status: "Solved" });
    const openRequests = await Request.countDocuments({ status: "Open" });

    res.json({ totalUsers, totalRequests, solvedRequests, openRequests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const requests = await Request.find()
      .populate("requester", "-password")
      .populate("helpers", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments();

    res.json({ requests, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = false;
    // Toggle a banned state using a convention (role set to banned or restore)
    if (user.role === "banned") {
      user.role = "both";
      await user.save();
      return res.json({ message: "User unbanned", user });
    }

    user.role = "banned";
    await user.save();
    res.json({ message: "User banned", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getStats, getRequests, deleteRequest, getUsers, banUser };
