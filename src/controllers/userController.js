const User = require("../models/User");

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
    const skillOptions = User.schema.path('skills').caster.enumValues;
    const interestOptions = User.schema.path('interests').caster.enumValues;
    const roleOptions = User.schema.path('role').caster.enumValues;
    const languageOptions = User.schema.path('languagesSpoken').caster.enumValues;
    const greetingOptions = User.schema.path('preferredGreeting').caster.enumValues;
    console.log(greetingOptions)
    console.log(userPreferences.preferredGreeting)
    res.render('preferences', {
      preferences: userPreferences,
      skillOptions: skillOptions,
      interestOptions: interestOptions,
      roleOptions: roleOptions,
      languageOptions: languageOptions,
      greetingOptions: greetingOptions,
      successMessage: req.flash('success')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'An error occurred');
  }
};

exports.updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    // Check if a new image was uploaded
    if (req.file) {
      req.body.profilePicture = "/uploads/" + req.file.filename;
    }
    console.log(req.body)
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
    role: user.role,
    favoriteBook: user.favoriteBook,
    preferredGreeting: user.preferredGreeting,
    profilePicture: user.profilePicture,
    languagesSpoken: user.languagesSpoken,
    location: user.location,
    contactMethods: user.contactMethods,
    socialMedia: user.socialMedia,
  };
};

exports.getRecommendedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    // Find users with the most matching interests
    const users = await User.find({
      _id: { $ne: req.user._id }, // Exclude current user
      interests: { $in: currentUser.interests },
    });

    res.render("recommendedUsers", { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};
