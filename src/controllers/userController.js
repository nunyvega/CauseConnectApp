const User = require("../models/User");
const Connection = require("../models/Connection");
const { ObjectId } = require('mongodb');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Excluding password field
    res.render("users", { users });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.renderPreferencesPage = async (req, res) => {
  try {
    const userId = req.user._id;
    const userPreferences = await exports.getUserPreferences(userId);

    // Get schema enum values for skills, interests, roles, and languages
    const skillOptions = User.schema.path("skills").caster.enumValues;
    const interestOptions = User.schema.path("interests").caster.enumValues;
    const roleOptions = User.schema.path("roles").caster.enumValues;
    const languageOptions =
      User.schema.path("languagesSpoken").caster.enumValues;
    const greetingOptions =
      User.schema.path("preferredGreeting").caster.enumValues;

    res.render("preferences", {
      preferences: userPreferences,
      skillOptions: skillOptions,
      interestOptions: interestOptions,
      roleOptions: roleOptions,
      languageOptions: languageOptions,
      greetingOptions: greetingOptions,
      personalBio: userPreferences.personalBio,
      successMessage: req.flash("success"),
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred");
  }
};

exports.updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    // Check if a new image was uploaded
    if (req.file) {
      req.body.profilePicture = "/uploads/" + req.file.filename;
    }
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    req.flash("success", "Preferences updated successfully");
    res.redirect("/user/preferences");
  } catch (err) {
    console.error(err); // It should be err not error
    req.flash("error", "An error occurred while updating preferences");
    res.redirect("/user/preferences");
  }
};

exports.getUserPreferences = async function (userId) {
  const user = await User.findById(userId);
  return {
    name: user.name,
    age: user.age,
    skills: user.skills,
    interests: user.interests,
    roles: user.roles,
    favoriteBook: user.favoriteBook,
    preferredGreeting: user.preferredGreeting,
    profilePicture: user.profilePicture,
    languagesSpoken: user.languagesSpoken,
    location: user.location,
    contactMethods: user.contactMethods,
    socialMedia: user.socialMedia,
    personalBio: user.personalBio,
  };
};

// Weighted values for each preference category
const WEIGHTS = {
  interests: 1,
  roles: 2,
  skills: 1.5,
  languagesSpoken: 3,
};

exports.getRecommendedUsers = async (req, res) => {
  try {
    const currentUser = (await User.findById(req.user._id)) || {};
    currentUser.interests = currentUser.interests || [];
    currentUser.roles = currentUser.roles || [];
    currentUser.skills = currentUser.skills || [];
    currentUser.languagesSpoken = currentUser.languagesSpoken || [];

    const MAX_SCORE =
      currentUser.interests.length * WEIGHTS.interests +
      currentUser.roles.length * WEIGHTS.roles +
      currentUser.skills.length * WEIGHTS.skills +
      currentUser.languagesSpoken.length * WEIGHTS.languagesSpoken;

    const connections = await Connection.find({
      $or: [{ user1: req.user._id }, { user2: req.user._id }],
    });
  
    const metUserIds = connections.map((conn) =>
    new ObjectId(conn.user1.toString() === req.user._id.toString()
      ? conn.user2.toString()
      : conn.user1.toString())
  );

    const pipeline = [
      {
        $match: { _id: { $ne: currentUser._id } }, // Exclude current user
      },
      {
        $match: { _id: { $nin: metUserIds } } // Exclude already met users
      },
      {
        $project: {
          interests: { $ifNull: ["$interests", []] },
          roles: { $ifNull: ["$roles", []] },
          skills: { $ifNull: ["$skills", []] },
          languagesSpoken: { $ifNull: ["$languagesSpoken", []] },
          username: 1,
          profilePicture: 1,
          name: 1,
          age: 1,
        },
      },
      {
        $addFields: {
          commonInterests: {
            $size: {
              $setIntersection: ["$interests", currentUser.interests],
            },
          },
          commonRoles: {
            $size: {
              $setIntersection: ["$roles", currentUser.roles],
            },
          },
          commonSkills: {
            $size: {
              $setIntersection: ["$skills", currentUser.skills],
            },
          },
          commonLanguages: {
            $size: {
              $setIntersection: [
                "$languagesSpoken",
                currentUser.languagesSpoken,
              ],
            },
          },
        },
      },

      {
        $addFields: {
          MAX_SCORE_CONSTANT: MAX_SCORE,
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$commonInterests", WEIGHTS.interests] },
              { $multiply: ["$commonRoles", WEIGHTS.roles] },
              { $multiply: ["$commonSkills", WEIGHTS.skills] },
              { $multiply: ["$commonLanguages", WEIGHTS.languagesSpoken] },
            ],
          },
        },
      },
      {
        $addFields: {
          similarityScore: {
            $min: [
              100,
              {
                $multiply: [
                  {
                    $divide: ["$score", "$MAX_SCORE_CONSTANT"],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },

      {
        $sort: { score: -1 }, // Sort by descending score
      },
    ];
    
    const users = await User.aggregate(pipeline);
    res.render("recommendedUsers", { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};
