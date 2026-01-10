const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  completed: { type: Boolean, default: false }
});

const playlistSchema = new mongoose.Schema({
  level: String,
  playlistId: String,
  videos: [videoSchema]
});

const roadmapSchema = new mongoose.Schema({
  skill: String,
  playlists: [playlistSchema]
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    college: {  
        type: String,
        required: false
    },
    branch: {  
        type: String,
        // required: false
    },
    cgpa : {
        type: String,
    },
    skills : [
        {
            name : { type: String },
            category : { type: String },
        }
    ],
    skillRatings: [
    {
      skillName: String,
      level: Number,
      lastUpdated: { type: Date, default: Date.now },
    }
    ],
    interests : {
        type : String
    },
    achievements : {
        type : String
    },
    collegePlaceId : {
        type : String
    },
    aiRecommendations: {
    internships: String,
    skills: String,
    roadmap: String,
    generatedAt: Date
  },
  appliedInternships: [
  {
    internshipId: String,
    appliedAt: { type: Date, default: Date.now }
  }
],
    embedding: {
    type: Array,
    default: []
    },

    skillGapCache: {
        fullStack: [String],
        missing: [
            {
            name: String,
            reason: String,
            progress: { type: Number, default: 0 }
            }
        ],
        completionScore: Number,
        generatedAt: Date
    },
    
    roadmapProgress: {
    type: Map,
    of: new mongoose.Schema({
        completedSteps: [String],
        progress: {type: Number, default: 0}
    }),
    default: {}
    },

    roadmaps : {
        type : Map, 
        of : roadmapSchema,
        default: {}
    },



}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
