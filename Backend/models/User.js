const mongoose = require('mongoose');

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


}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
