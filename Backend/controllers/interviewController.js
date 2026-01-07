const { VertexAI } = require("@google-cloud/vertexai");
const User = require("../models/User");

const vertex = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID,
  location: "us-central1",
  keyFilename: "./google/service-key.json"
});

const model = vertex.getGenerativeModel({
  model: "gemini-2.0-flash"
});

const session = { };

    async function generateQuestion(skill, level) {

  const prompt = `
Act as a professional ${skill} interviewer.
Ask ONE ${level} difficulty question.
Short, precise, no explanation.
Return JSON:
{
 "level":"${level}",
 "question":""
}`;

  const result = await model.generateContent({
    contents: [{
        role : "user",
        parts: [{ text: prompt }] }]
  });

  return JSON.parse(result.response.candidates[0].content.parts[0].text.replace(/```json|```/g,""));
}


// ------------------ START INTERVIEW -------------------
exports.startInterview = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.skills.length)
      return res.status(400).json({ error: "No skills found" });

    session[email] = {
      skills: user.skills.map(s => s.name),
      index: 0,
      difficulty: "easy",
      currentSkillScore: 0,
      answered: 0,
      authenticityPenalty: 0,
      report: []
    };

    const skill = session[email].skills[0];
    const question = await generateQuestion(skill, "easy");
    session[email].asked = [question];

    res.json({
      skill,
      question
    });

  } catch (err) {
    console.log("START ERROR", err);
    res.status(500).json({ error: "Interview start failed" });
  }
};


// 🎤 EVALUATE ANSWER
exports.evaluateInterview = async (req, res) => {
  try {
    const { email, answer, blurCount } = req.body;

    const state = session[email];
    if (!state) return res.status(400).json({ error: "Session expired" });

    state.authenticityPenalty += blurCount * 10;

    const currentSkill = state.skills[state.index];
    const lastQuestion = state.asked[state.asked.length - 1];

    const prompt = `
Evaluate this interview response.

Skill: ${currentSkill}
Difficulty: ${lastQuestion.level}
Question: ${lastQuestion.question}
Answer: ${answer}

Return JSON ONLY:
{
 "score": 0,
 "difficultyChange": "harder | easier | same",
 "feedback": ""
}
`;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ]
    });

    const json = JSON.parse(
      result.response.candidates[0].content.parts[0].text.replace(/```json|```/g, "")
    );

    state.currentSkillScore += json.score;
    state.answered++;

    if (json.difficultyChange === "harder") state.difficulty = "medium";
    if (json.difficultyChange === "same") state.difficulty = "advanced";
    if (json.difficultyChange === "easier") state.difficulty = "easy";


    // ⭐ 3 QUESTIONS COMPLETED → FINALIZE THIS SKILL
    if (state.answered === 3) {
      const final = Math.round((state.currentSkillScore / 3) / 10);

      state.report.push({
        skill: currentSkill,
        level: final
      });

      state.index++;
      state.currentSkillScore = 0;
      state.answered = 0;
      state.difficulty = "easy";

      // ALL SKILLS DONE
      if (state.index >= state.skills.length) {
        return res.json({ done: true });
      }
    }

    const nextSkill = state.skills[state.index];
    const nextQ = await generateQuestion(nextSkill, state.difficulty);
    state.asked.push(nextQ);

    res.json({
      done: false,
      skill: nextSkill,
      nextQuestion: nextQ,
      feedback: json.feedback
    });

  } catch (err) {
    console.log("EVAL ERROR", err);
    res.status(500).json({ error: "Evaluation failed" });
  }
};


// 🏁 FINISH INTERVIEW
exports.finishInterview = async (req, res) => {
  try {
    const { email } = req.body;

    const state = session[email];
    if (!state) return res.status(400).json({ error: "Session expired" });

    const authenticity = Math.max(0, 100 - state.authenticityPenalty);

    const user = await User.findOne({ email });

    user.skillRatings = state.report.map(r => ({
      skillName: r.skill,
      level: r.level
    }));

    await user.save();

    delete session[email];

    res.json({
      finalReport: user.skillRatings,
      authenticityScore: authenticity
    });

  } catch (err) {
    res.status(500).json({ error: "Finish failed" });
  }
};