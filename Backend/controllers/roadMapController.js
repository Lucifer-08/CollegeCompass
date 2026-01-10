const User = require("../models/User");
const generateRoadmap = require("../google/vertexSkillGap");

exports.createRoadmap = async (req, res) => {
  try {
    const { email, skill } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const safeSkillKey = skill.replace(/\./g, "_");

    // ✅ Ensure maps exist
    if (!user.roadmaps) user.roadmaps = new Map();
    if (!user.roadmapProgress) user.roadmapProgress = new Map();

    // ✅ Return cached roadmap
    if (user.roadmaps.has(safeSkillKey)) {
      return res.json(user.roadmaps.get(safeSkillKey ));
    }

    // 👉 Generate roadmap using Gemini / Vertex
    const roadmap = await generateRoadmap(skill, user);

    user.roadmaps.set(safeSkillKey, roadmap);
    user.roadmapProgress.set(safeSkillKey, {
      completedSteps: [],
      progress: 0
    });

    await user.save();

    res.json(roadmap);
  } catch (err) {
    console.log("ROADMAP ERROR:", err.message);
    res.status(500).json({ error: "Roadmap failed" });
  }
};
