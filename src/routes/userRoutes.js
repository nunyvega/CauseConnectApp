const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');  // 'public/uploads/' is the directory where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the date and original extension to the filename
  }
});

const upload = multer({ storage: storage });

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('User is not authenticated');
    res.redirect('/login');
}

router.post('/preferences', userController.updateUserPreferences);

router.get('/preferences', isAuthenticated, async (req, res) => {
    try {
        // Get the user preferences
        console.log('fprefos');
        const preferences = await userController.getUserPreferences(req.user.id);
        
        // Get flash messages
        const successMessage = req.flash('success');
        const errorMessage = req.flash('error');

        // Render the view with the preferences
        res.render('preferences', { preferences, successMessage, errorMessage });
    } catch (error) {
        console.error(error);
        // Handle error (e.g., render an error page or redirect)
        res.status(500).send('An error occurred while retrieving preferences');
    }
});

// New route to handle profile picture uploads
router.post('/uploadProfile', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        const profilePictureUrl = `/uploads/${req.file.filename}`;
        const user = await User.findById(req.user.id); // Make sure you import your User model at the top
        user.profilePicture = profilePictureUrl;
        await user.save();
        req.flash('success', 'Profile picture updated successfully.');
        res.redirect('/preferences');  // Redirecting back to preferences after successful upload
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to upload profile picture.');
        res.redirect('/preferences');
    }
});

module.exports = router;
