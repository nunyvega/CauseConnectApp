// User model representing individual users in the system.
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  // Basic user details
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  personalBio: String,
  age: Number,

  // User skills, interests, and roles
  skills: [
    {
      type: String,
      enum: [
        "Fundraising",
        "Event Planning",
        "Content Creation",
        "Project Management",
        "Grant Writing",
        "Community Outreach",
        "Social Media Marketing",
        "Research & Analysis",
        "Volunteer Coordination",
        "Graphic Design",
        "Public Speaking",
        "Data Collection & Reporting",
        "Financial Planning",
        "Leadership & Supervision",
        "Strategic Partnerships",
        "Conflict Resolution",
      ],
    },
  ],
  interests: [
    {
      type: String,
      enum: [
        "Community Development",
        "Environmental Conservation",
        "Mental Health Awareness",
        "Youth Empowerment",
        "Animal Welfare",
        "Cultural Heritage Preservation",
        "Arts & Crafts",
        "Food Security & Nutrition",
        "Elderly Care & Support",
        "Disaster Relief & Preparedness",
        "Sustainable Agriculture",
        "Education & Literacy",
        "Healthcare Access",
        "Gender Equality",
        "Human Rights Advocacy",
        "Clean Energy & Climate Change",
      ],
    },
  ],
  roles: [
    {
      type: String,
      enum: [
        "Board Member",
        "Project Manager",
        "Volunteer Coordinator",
        "Content Creator",
        "Fundraiser",
        "Research Analyst",
        "Community Liaison",
        "Social Media Manager",
        "Event Planner",
        "Finance & Accounting",
        "Training & Development Specialist",
        "Partnerships & Sponsorships",
        "Graphic Designer",
        "Public Relations Officer",
        "Technical Specialist",
        "Field Operative",
      ],
    },
  ],

  // Other preferences
  favoriteBook: String,
  preferredGreeting: [
    {
      type: String,
      enum: ["hug", "handshake", "high five", "fist bump", "wave"],
    },
  ],
  profilePicture: {
    type: String,
    default: "/uploads/profile.png",
  },
  languagesSpoken: [
    {
      type: String,
      enum: [
        "English",
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Arabic",
        "Hindi",
        "Portuguese",
        "Russian",
        "Japanese",
        "Swahili",
        "Bengali",
        "Urdu",
        "Italian",
        "Dutch",
      ],
    },
  ],
  location: String,

  // Contact information
  contactMethods: {
    email: String,
    phone: String,
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String,
    website: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Hashing the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
