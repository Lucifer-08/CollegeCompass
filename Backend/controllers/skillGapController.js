const User = require("../models/User");
const analyzeSkillGap = require("../google/vertexSkillGap");

exports.skillGap = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.skills?.length)
      return res.json({ error: "User has no skills saved" });

    const category = user.branch || "Software Development";
    const skills = user.skills.map(s => s.name);

    const result = await analyzeSkillGap(category, skills);

    res.json(result);
  
  } catch (err) {
    console.log("VERTEX ERROR:", err.message);
    res.status(500).json({ error: "Skill gap failed" });
  }
};
