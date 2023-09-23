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

/**
 * Middleware to ensure the user is an admin.
 *
 * If the user is authenticated and is an admin, it continues to the next step in the request-response cycle.
 * If the user is not an admin, it sends a forbidden response.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next(); // If user is an admin, proceed to the next middleware or route handler
    } else {
      res.status(403).send('Forbidden: You do not have the required permissions, you need to be an admin to use the API endpoints.');
    }
  } else {
    req.flash("error", "Please log in to view this page.");
    res.redirect("/login");
  }
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin
}; // Export the middleware functions
