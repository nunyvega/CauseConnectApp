const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(
    async function (username, password, done) {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false);
        }
  
        // Compare password with stored hash
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

// Connect to MongoDB
mongoose.connect('mongodb://localhost/CauseConnect', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/connections/all', // Redirect to the desired route after successful login. For the moment I'm testing the met people page
    failureRedirect: '/login', 
    failureFlash: 'Invalid username or password.' 
  })
);

// Import other routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);
const connectionRoutes = require('./routes/connectionRoutes');
app.use('/connections', connectionRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
