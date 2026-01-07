const express = require("express");
const {register,login,saveProfile,getStackAnalysis,getProfile} = require("../controllers/userController");
const {hasSkillChart,saveSkillChart,getSkillChart} = require("../controllers/skillChartController");
const { getRecommendedInternships } = require("../controllers/intershipController");
const { skillGap } = require("../controllers/skillGapController");
const { getSkillRoadmap } = require("../controllers/roadMapController");
const { startInterview, evaluateInterview , finishInterview } = require("../controllers/interviewController");
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/save-profile",saveProfile);
router.post("/get-profile", getProfile);
router.post("/has-skill-chart", hasSkillChart);
router.post("/save-skill-chart", saveSkillChart);
router.post("/get-skill-chart", getSkillChart); 
router.post("/recommended-internships", getRecommendedInternships);
router.post("/skill-gap", skillGap); 
router.post("/stack-analysis", getStackAnalysis);
router.post("/skill-roadmap", getSkillRoadmap);
router.post("/start-interview", startInterview);
router.post("/evaluate-interview", evaluateInterview);
router.post("/finish-interview", finishInterview);


module.exports = router;
