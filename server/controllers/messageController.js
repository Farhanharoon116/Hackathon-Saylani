const Message = require("../models/Message");
const Notification = require("../models/Notification");

const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "-password")
      .populate("recipient", "-password")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { recipient, content, requestRef } = req.body;

    if (!recipient || !content) {
      return res.status(400).json({ message: "Recipient and content are required" });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient,
      content,
      requestRef: requestRef || undefined,
    });

    await Notification.create({
      user: recipient,
      type: "Status",
      message: `New message from ${req.user.name}`,
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "-password")
      .populate("recipient", "-password");

    res.status(201).json({ message: populated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMessages, sendMessage };
