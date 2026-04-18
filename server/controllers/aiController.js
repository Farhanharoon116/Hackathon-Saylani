const { askGemini } = require("../utils/gemini");
const Request = require("../models/Request");
const User = require("../models/User");

const suggest = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const prompt = `Given this help request:\nTitle: "${title}"\nDescription: "${description}"\nRespond ONLY in JSON (no markdown, no explanation):\n{"category": "one of: Web Development, Design, Career, Data Science, Mobile, DevOps, Other", "urgency": "one of: Low, Medium, High", "tags": ["up to 5 relevant tags"], "rewriteSuggestion": "improved version of the description"}`;

    const result = await askGemini(prompt);

    if (!result) {
      return res.json({
        category: "Other",
        urgency: "Medium",
        tags: [],
        rewriteSuggestion: description,
      });
    }

    try {
      // Strip markdown code fences if present
      const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    } catch (parseError) {
      return res.json({
        category: "Other",
        urgency: "Medium",
        tags: [],
        rewriteSuggestion: description,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const onboarding = async (req, res) => {
  try {
    const { skills, interests } = req.body;

    const prompt = `A user has these skills: ${(skills || []).join(", ")} and interests: ${(interests || []).join(", ")}. Suggest 3-5 help categories they could contribute to and 3-5 types of requests they might need help with. Respond ONLY in JSON (no markdown, no explanation):\n{"canHelpWith": ["category1", "category2"], "mightNeedHelpWith": ["category1", "category2"], "suggestedSkills": ["skill1", "skill2"]}`;

    const result = await askGemini(prompt);

    if (!result) {
      return res.json({
        canHelpWith: [],
        mightNeedHelpWith: [],
        suggestedSkills: [],
      });
    }

    try {
      const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    } catch (parseError) {
      return res.json({
        canHelpWith: [],
        mightNeedHelpWith: [],
        suggestedSkills: [],
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const insights = async (req, res) => {
  try {
    // Aggregate data from DB
    const totalRequests = await Request.countDocuments();
    const openRequests = await Request.countDocuments({ status: "Open" });
    const solvedRequests = await Request.countDocuments({ status: "Solved" });

    const categoryAgg = await Request.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const urgencyAgg = await Request.aggregate([
      { $match: { status: "Open" } },
      { $group: { _id: "$urgency", count: { $sum: 1 } } },
    ]);

    const topMentors = await User.find()
      .sort({ trustScore: -1 })
      .limit(5)
      .select("name trustScore contributions skills");

    const summaryPrompt = `Given these community stats:
- Total requests: ${totalRequests}, Open: ${openRequests}, Solved: ${solvedRequests}
- Top categories: ${categoryAgg.map((c) => `${c._id}: ${c.count}`).join(", ")}
- Open by urgency: ${urgencyAgg.map((u) => `${u._id}: ${u.count}`).join(", ")}
- Top mentors: ${topMentors.map((m) => m.name).join(", ")}
Provide a brief community insights summary in 2-3 sentences. Respond as plain text.`;

    let aiSummary = "";
    try {
      const result = await askGemini(summaryPrompt);
      if (result) aiSummary = result;
    } catch (err) {
      // Gemini failed
    }

    res.json({
      trendPulse: categoryAgg,
      urgencyWatch: urgencyAgg,
      mentorPool: topMentors,
      totalRequests,
      openRequests,
      solvedRequests,
      aiSummary,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { suggest, onboarding, insights };
