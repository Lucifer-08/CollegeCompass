const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Register
exports.register = async (req,res)=>{
  try{
    const {name,email,password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists) return res.json({message:"User already exists"});

    const hash = await bcrypt.hash(password,10);
    const user = await User.create({name,email,password:hash});

    res.json(user);
  }catch(e){
    res.json(e);
  }
};

// Login
exports.login = async(req,res)=>{
  const {email,password}=req.body;
  const user = await User.findOne({email});
  if(!user) return res.json({message:"No user"});

  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.json({message:"Wrong password"});

  const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
  res.json({token,user});
};

// Save Profile
exports.saveProfile = async(req,res)=>{
  try{
  const {email,college,branch,cgpa,skills,interests,achievements} = req.body;
  const user = await User.findOneAndUpdate(
    {email},
    {college,branch,cgpa,skills,interests,achievements},
    {new:true}
  );
  res.json(user);
}catch(e){
  res.status(500).json({message:"Error in Saving Profile" , error: e});
}
};
// Get Profile

exports.getProfile = async(req,res)=>{
  const {email} = req.body;
  const user = await User.findOne({email});
  res.json(user);
};


// AI Recommendation
// AI Recommendation - Updated for Semantic Skill Objects
exports.getStackAnalysis = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user || !user.skills?.length){
      return res.json({ error: "No skills found" });
    }

    const category = user.branch || "Software Development";
    const currentSkills = user.skills.map(s => s.name).join(", ");

    const prompt = `
      As a Technical Architect, analyze the "${category}" career path.
      The user currently knows: ${currentSkills}.
      
      Tasks:
      1️⃣ Define the COMPLETE industry-standard stack.
      2️⃣ Identify EXACT missing technologies.
      3️⃣ Give a Completion Percentage.

      Return ONLY JSON:
      {
        "fullStack": ["React","Node.js","Express","MongoDB"],
        "missing": [
          {"name":"Node.js","reason":"Required for backend APIs"}
        ],
        "completionScore": 65
      }
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, "");
    const result = JSON.parse(clean);

    res.json(result);

  } catch (err) {
    console.log("STACK GAP ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Stack analysis failed" });
  }
};

exports.hasSkillChart = async(req,res)=>{
  const { email } = req.body;

  const user = await User.findOne({email});

  if(!user) return res.json({exists:false});

  if(user.skillRatings && user.skillRatings.length>0)
    return res.json({exists:true});

  return res.json({exists:false});
};

exports.hasSkillChart = async(req,res)=>{
  const { email } = req.body;

  const user = await User.findOne({email});

  if(!user) return res.json({exists:false});

  if(user.skillRatings && user.skillRatings.length>0)
    return res.json({exists:true});

  return res.json({exists:false});
};

exports.getSkillChart = async(req,res)=>{
  const { email } = req.body;

  const user = await User.findOne({email});

  res.json(user.skillRatings || []);
};


