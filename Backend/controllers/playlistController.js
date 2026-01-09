const axios = require("axios");
const User = require("../models/User");     

exports.fetchPlaylistVideos = async (playlistId) => {
  const res = await axios.get(
    "https://www.googleapis.com/youtube/v3/playlistItems",
    {
      params: {
        part: "snippet",
        playlistId,
        maxResults: 50,
        key: process.env.GEMINI_KEY
      }
    }
  );

  return res.data.items.map(v => ({
    videoId: v.snippet.resourceId.videoId,
    title: v.snippet.title,
    completed: false
  }));
};

// playlistController.js

exports.markVideo = async (req, res) => {
  try {
    const { email, skill, playlistId, videoId } = req.body;
    
    // 1. Validation to prevent the "undefined" key error
    if (!skill) return res.status(400).json({ error: "Skill name is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. FIX: access Map using .get() instead of .find()
    const roadmap = user.roadmaps.get(skill); 
    if (!roadmap) return res.status(404).json({ error: "Roadmap not found" });

    const playlist = roadmap.playlists.find(p => p.playlistId === playlistId);
    const video = playlist?.videos.find(v => v.videoId === videoId);

    if (video) {
      video.completed = true;
      user.markModified('roadmaps'); // Required for nested Map updates in Mongoose
      await user.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// playlistController.js

exports.updateRoadmapProgress = async (req, res) => {
  try {
    const { email, skill, stepId } = req.body;

    if (!skill) return res.status(400).json({ error: "Skill name is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const safeSkillKey = skill.replace(/\./g, "_");

    // CRITICAL FIX: If the DB currently has an Array [], force it to a Map
    if (!user.roadmapProgress || Array.isArray(user.roadmapProgress)) {
      user.roadmapProgress = new Map();
    }

    // Use .get() for Maps
    let progressData = user.roadmapProgress.get(safeSkillKey) || {
      completedSteps: [],
      progress: 0
    };

    // Add step if not already present
    if (stepId && !progressData.completedSteps.includes(stepId)) {
      progressData.completedSteps.push(stepId);
    }

    // Safely calculate progress %
    const roadmap = user.roadmaps?.get(safeSkillKey);
    const totalSteps = roadmap?.totalSteps || 5; // Fallback to avoid division by zero

    progressData.progress = Math.round(
      (progressData.completedSteps.length / totalSteps) * 100
    );

    // Use .set() for Maps
    user.roadmapProgress.set(safeSkillKey, progressData);
    
    // IMPORTANT: Tell Mongoose the Map has changed so it actually saves
    user.markModified('roadmapProgress'); 
    
    await user.save();
    res.json(progressData);
  } catch (err) {
    console.error("ROADMAP PROGRESS ERROR:", err.message);
    res.status(500).json({ error: "Progress update failed" });
  }
};