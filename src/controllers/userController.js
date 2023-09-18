const User = require("../models/User");
const Connection = require("../models/Connection");
const { ObjectId } = require("mongodb");
const languageToFlag = require("../public/js/languageToFlag");

// Fetch all users excluding their passwords
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.render("users", { users });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Render the user preferences page
exports.renderPreferencesPage = async (req, res) => {
  try {
    const userId = req.user._id;
    const userPreferences = await exports.getUserPreferences(userId);

    const skillOptions = User.schema.path("skills").caster.enumValues;
    const interestOptions = User.schema.path("interests").caster.enumValues;
    const roleOptions = User.schema.path("roles").caster.enumValues;
    const languageOptions =
      User.schema.path("languagesSpoken").caster.enumValues;
    const greetingOptions =
      User.schema.path("preferredGreeting").caster.enumValues;

    res.render("preferences", {
      preferences: userPreferences,
      skillOptions,
      interestOptions,
      roleOptions,
      languageOptions,
      greetingOptions,
      personalBio: userPreferences.personalBio,
      successMessage: req.flash("success"),
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred");
  }
};

// Update user's preferences
exports.updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.file) {
      req.body.profilePicture = "/uploads/" + req.file.filename;
    }
    await User.findByIdAndUpdate(userId, req.body, { new: true });
    req.flash("success", "Preferences updated successfully");
    res.redirect("/user/preferences");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while updating preferences");
    res.redirect("/user/preferences");
  }
};

// Get a specific user's preferences
exports.getUserPreferences = async function (userId) {
  const user = await User.findById(userId).select("-password");
  return user;
};

const WEIGHTS = {
  interests: 1,
  roles: 2,
  skills: 1.5,
  languagesSpoken: 3,
};

// Get recommended users based on preferences
exports.getRecommendedUsers = async (req, res) => {
  try {
    const currentUser = (await User.findById(req.user._id)) || {};

    // Ensure currentUser has all required properties or set them to empty arrays
    ["interests", "roles", "skills", "languagesSpoken"].forEach((prop) => {
      currentUser[prop] = currentUser[prop] || [];
    });

    // Calculate max score based on current user's preferences and weights
    const MAX_SCORE =
      Object.keys(WEIGHTS).reduce(
        (acc, key) => acc + currentUser[key].length * WEIGHTS[key],
        0
      ) || 1;

    const connections = await Connection.find({
      $or: [{ user1: req.user._id }, { user2: req.user._id }],
    });

    const metUserIds = connections.map(
      (conn) =>
        new ObjectId(
          conn.user1.toString() === req.user._id.toString()
            ? conn.user2.toString()
            : conn.user1.toString()
        )
    );

    // Recommendation pipeline
    const pipeline = [
      {
        $match: { _id: { $ne: currentUser._id, $nin: metUserIds } },
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
        $sort: { score: -1 },
      },
    ];

    const users = await User.aggregate(pipeline);
    res.render("recommendedUsers", {
      users: users,
      languageToFlag: languageToFlag,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};
