const { VertexAI } = require("@google-cloud/vertexai");

const vertex = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID,
  location: "us-central1",
  keyFilename: "./google/service-key.json",
});

const model = vertex.getGenerativeModel({
  model: "gemini-2.0-flash",
});


async function analyzeSkillGap(category, skills) {
  const prompt = `
User Career: ${category}
User Skills: ${skills.join(", ")}

1. Identify the complete professional TECHNICAL stack (Hard Skills only) for this career.
2. DO NOT include soft skills, management skills, or personal traits (e.g., leadership, communication, time management).
3. Identify missing technical tools, frameworks, or languages with explanation.
4. Give a technical readiness score from 0-100.

Return ONLY JSON:
{
 "fullStack": [],
 "missing": [
  {"name":"", "reason":""}
 ],
 "completionScore": 0
}
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text =
    result.response.candidates[0].content.parts[0].text;

  return JSON.parse(text.replace(/```json|```/g, ""));
}

module.exports = analyzeSkillGap;
