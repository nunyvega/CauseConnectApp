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
const { ensureAuthenticated } = require("./middleware/authMiddleware");
const { spawn } = require("child_process");
const statisticToShow = require("./public/js/statisticsPool");
const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: secret,
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

// Passport configuration for local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false);

      // Compare password with stored hash
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        return isMatch ? done(null, user) : done(null, false);
      });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// MongoDB connection setup
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/CauseConnect";

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes setup
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: "Invalid username or password.",
  })
);

// Import and use other routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const apiRoutes = require("./routes/apiRoutes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use(connectionRoutes);
app.use("/api", apiRoutes);

// Home route with statistics
app.get("/", async (req, res) => {
  // Redirect to login page if not authenticated
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const currentUserId = req.user._id;
  const totalUsers = await User.countDocuments({ _id: { $ne: currentUserId } });
  const totalConnections = await Connection.countDocuments({
    $or: [{ user1: currentUserId }, { user2: currentUserId }],
  });
  const percentageMet = totalUsers ? (totalConnections / totalUsers) * 100 : 0;

  res.render("home", {
    percentageMet,
    totalUsers,
    metUsers: totalConnections,
    statisticToShow: statisticToShow.message,
  });
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// Route to run seed script
app.post("/run-seed", (req, res) => {
  const seedProcess = spawn("node", ["./src/scripts/seedUsers.js"]);

  seedProcess.stdout.on("data", (data) => console.log(`stdout: ${data}`));
  seedProcess.stderr.on("data", (data) => console.error(`stderr: ${data}`));
  seedProcess.on("close", (code) => {
    if (code !== 0) {
      console.log(`seedUsers.js process exited with code ${code}`);
      return res.status(500).send("Failed to run seed script.");
    }
    res.redirect("/login");
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
