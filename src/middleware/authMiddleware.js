/**
 * Middleware to ensure the user is authenticated.
 *
 * If the user is authenticated, it continues to the next step in the request-response cycle.
 * If the user is not authenticated, it redirects them to the login page with an error message.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // If user is authenticated, proceed to the next middleware or route handler
  } else {
    req.flash("error", "Please log in to view this page."); // Flash an error message
    res.redirect("/login"); // Redirect the user to the login page
  }
}

module.exports = ensureAuthenticated; // Export the middleware function
