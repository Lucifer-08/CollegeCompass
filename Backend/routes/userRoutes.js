const express = require("express");
const {register,login,saveProfile,getStackAnalysis,getProfile} = require("../controllers/userController");
const {hasSkillChart,saveSkillChart,getSkillChart} = require("../controllers/skillChartController");
const { getRecommendedInternships } = require("../controllers/intershipController");
const { getSkillGap } = require("../controllers/skillGapController");
const { createRoadmap } = require("../controllers/roadMapController");
const { startInterview, evaluateInterview , finishInterview } = require("../controllers/interviewController");
const { markVideo , fetchPlaylistVideos , updateRoadmapProgress} = require("../controllers/playlistController");

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/save-profile",saveProfile);
router.post("/get-profile", getProfile);
router.post("/has-skill-chart", hasSkillChart);
router.post("/save-skill-chart", saveSkillChart);
router.post("/get-skill-chart", getSkillChart); 
router.post("/recommended-internships", getRecommendedInternships);
router.post("/skill-gap", getSkillGap); 
router.post("/stack-analysis", getStackAnalysis);
router.post("/skill-roadmap", createRoadmap);
router.post("/playlist-videos", fetchPlaylistVideos);
router.post("/video-mark", markVideo);
router.post("/start-interview", startInterview);
router.post("/evaluate-interview", evaluateInterview);
router.post("/finish-interview", finishInterview);
router.post("/roadmap-progress", updateRoadmapProgress);


router.post("/roadmap-progress-all", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Return the whole roadmapProgress map as an object
    res.json(user.roadmapProgress || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
