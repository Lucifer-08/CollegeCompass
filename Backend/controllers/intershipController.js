const axios = require("axios");
const User = require("../models/User");
const getEmbedding = require("../google/vertexClient");
const cosineSimilarity = require("../config/similarity");

let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const jobCache = new Map();

/**
 * Calculates AI match score with rate-limiting protection
 */
async function aiMatch(userVector, job) {
  try {
    const jobText =
      (job.job_required_skills && job.job_required_skills.join(", ")) ||
      job.job_description ||
      "";

    if (!jobCache.has(job.job_id)) {
      // 1. Add a small artificial delay (200ms) to respect API Rate Limits
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const jobVector = await getEmbedding(jobText);
      jobCache.set(job.job_id, jobVector);
    }

    const jobVector = jobCache.get(job.job_id);
    const score = cosineSimilarity(userVector, jobVector);
    return Math.round(score * 100);
  } catch (err) {
    console.error(`Error matching job ${job.job_id}:`, err.message);
    return 0; // Fallback score
  }
}

exports.getRecommendedInternships = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.skillRatings?.length) {
      return res.json([]);
    }

    // ---------- USER EMBEDDING ----------
    let userVector = user.embedding;

    if (!userVector || userVector.length === 0) {
      console.log("Generating User Embedding...");

      const userText = user.skillRatings
        .map(s => `${s.skillName} level ${s.level}`)
        .join(", ");

      try {
        userVector = await getEmbedding(userText);
        // Replace user.embedding = userVector; await user.save(); with:
        await User.findOneAndUpdate(
          { email: email },
          { $set: { embedding: userVector } },
          { new: true }
        );
        // await user.save();
      } catch (err) {
        console.log("Vertex AI failed creating user embedding:", err.message);
        return res.json([]);
      }
    }

    // ---------- FETCH INTERNSHIPS ----------
    let internships = [];
    
    if (cachedData && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      console.log("Serving internships from cache 😊");
      internships = cachedData;
    } else {
      const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
        params: {
          query: `${user.interests || "internship"} internship`,
          num_pages: 1
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
      });

      internships = response.data.data;
      cachedData = internships;
      lastFetchTime = Date.now();
    }

    // ---------- SEQUENTIAL AI MATCHING ----------
    // We use a for...of loop instead of Promise.all to prevent 
    // flooding Vertex AI with 10+ requests at the same millisecond.
    const results = [];
    for (const job of internships) {
      await new Promise(resolve => setTimeout(resolve, 250)); // Small delay between requests
      const matchScore = await aiMatch(userVector, job);
      results.push({
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city || "Remote",
        description: job.job_description,
        skills: job.job_required_skills || [],
        link: job.job_apply_link,
        logo: job.employer_logo,
        matchScore: matchScore
      });
    }

    results.sort((a, b) => b.matchScore - a.matchScore);
    res.json(results);

  } catch (err) {
    console.log("CRITICAL ERROR:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};