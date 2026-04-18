const User = require("../models/User");

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select("name trustScore contributions badges avatar skills location")
      .sort({ trustScore: -1 })
      .limit(10);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, location, skills, interests } = req.body;

    const updateData = { onboarded: true };
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (skills !== undefined) updateData.skills = skills;
    if (interests !== undefined) updateData.interests = interests;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getLeaderboard, getUserById, updateProfile };
