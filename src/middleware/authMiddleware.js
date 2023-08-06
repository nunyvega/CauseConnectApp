// authMiddleware.js

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error', 'Please log in to view this page.');
      res.redirect('/login');
    }
  }
  
  module.exports = ensureAuthenticated;
  