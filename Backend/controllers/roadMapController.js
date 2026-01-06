const { VertexAI } = require("@google-cloud/vertexai");

const vertex = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID,
  location: "us-central1",
  keyFilename: "./google/service-key.json"
});

const model = vertex.getGenerativeModel({
  model: "gemini-2.0-flash"
});

exports.getSkillRoadmap = async (req, res) => {
  try {
    const { skill, userProfile } = req.body;

    const prompt = `
You are an expert career mentor.
Create a COMPLETE learning roadmap for: ${skill}

User Details:
Branch: ${userProfile.branch || "Unknown"}
Current Skills: ${userProfile.skills?.map(s=>s.name).join(", ") || "None"}
Interest: ${userProfile.interests || "General Tech"}

Return only JSON:
{
 "why_important": "",
 "time_required": "",
 "difficulty": "",
 "learning_path": {
    "beginner": ["step1","step2"],
    "intermediate": ["step1","step2"],
    "advanced": ["step1","step2"]
  },
  "projects": ["p1","p2","p3"],
  "recommended_resources": {
    "youtube": ["",""],
    "courses": ["",""],
    "documentation": ["",""]
  },
  "extra_tips": ""
}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const text = result.response.candidates[0].content.parts[0].text;
    const json = JSON.parse(text.replace(/```json|```/g, "").trim());

    res.json(json);

  } catch (err) {
    console.log("ROADMAP ERROR:", err.message);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
};
