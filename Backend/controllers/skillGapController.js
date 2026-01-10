const User = require("../models/User");
const analyzeSkillGap = require("../google/vertexSkillGap");

exports.getSkillGap = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });
    
    const categories = user.branch || ["Software Engineering"];
    const skills = user.skills ? user.skills.map(s => s.name) : []; 
    // ✅ RETURN CACHED RESULT
    if (
      user.skillGapCache &&
      Date.now() - new Date(user.skillGapCache.generatedAt).getTime() <
        7 * 24 * 60 * 60 * 1000
    ) {
      return res.json(user.skillGapCache);
    }

    // 👉 CALL VERTEX / GEMINI HERE (your existing code)
    const aiResult = await analyzeSkillGap(categories, skills);

    user.skillGapCache = {
      ...aiResult,
      generatedAt: new Date()
    };

    await user.save();

    res.json(user.skillGapCache);
  } catch (err) {
    console.error("STACK GAP ERROR:", err.message);
    res.status(500).json({ error: "Skill gap failed" });
  }
};

