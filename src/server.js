const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const flash = require("connect-flash");
const Connection = require("./models/Connection");
const ensureAuthenticated = require("./middleware/authMiddleware");
const { spawn } = require('child_process');
const statisticToShow = require('./public/js/statisticsPool');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new LocalStrategy(async function (username, password, done) {
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
  })
);

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
mongoose
  .connect("mongodb://localhost/CauseConnect", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Auth routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/", // Redirect to the desired route after successful login. For the moment I'm testing the met people page
    failureRedirect: "/login",
    failureFlash: "Invalid username or password.",
  })
);

// Import other routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);
const connectionRoutes = require("./routes/connectionRoutes");
app.use(connectionRoutes);

app.get("/", ensureAuthenticated, async (req, res) => {
  const currentUserId = req.user._id;

  // Get the total number of users, excluding the current user
  const totalUsers = await User.countDocuments({ _id: { $ne: currentUserId } });

  // Get the total number of connections involving the current user
  const totalConnections = await Connection.countDocuments({
    $or: [{ user1: currentUserId }, { user2: currentUserId }],
  });

  // Calculate the percentage
  const percentageMet = totalUsers ? (totalConnections / totalUsers) * 100 : 0;

  res.render("home", {
    percentageMet: percentageMet,
    totalUsers: totalUsers,
    metUsers: totalConnections, // This represents the number of users met
    statisticToShow: statisticToShow.message,
  });
});

// API endpoints
// Get all users
app.get('/api/users', async (req, res) => {
  try {
     const users = await User.find().select('-password');  // Excludes password field for security reasons
     res.json(users);
  } catch (error) {
     res.status(500).send('Internal Server Error');
  }
});

// Get a single user by username
app.get('/api/users/:username', async (req, res) => {
  try {
     const user = await User.findOne({ username: req.params.username }).select('-password'); // Excludes password field for security reasons
     if (user) {
        res.json(user);
     } else {
        res.status(404).send('User not found');
     }
  } catch (error) {
     res.status(500).send('Internal Server Error');
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/login"); // Redirect to the login page
  });
});


app.post('/run-seed', (req, res) => {
  // Execute the seed script to create users
  const seedProcess = spawn('node', ['./src/scripts/seedUsers.js']);

  seedProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
  });

  seedProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });

  seedProcess.on('close', (code) => {
      if (code !== 0) {
          console.log(`seedUsers.js process exited with code ${code}`);
          return res.status(500).send('Failed to run seed script.');
      }
      res.redirect('/login');
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


