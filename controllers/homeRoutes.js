const router = require("express").Router();
const bcrypt = require("bcrypt");
// Import any models you plan to use for data's routes here
const { User } = require("../models/");

// If you would like to use an authGuard middleware, import it here

// add a get / (landing page) route here
router.get("/", async (req, res) => {
  try {
    // Reminder- We're passing the examples data to the home handlebars template here!
    // Reminder- We're also passing the loggedIn status to the home template here so that we can conditionally render items if the user is logged in or not (like we do with the navbar using `{{if loggedIn}}`).
    res.render("home", {
      loggedIn: req.session.logged_in,
      username: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// add a get /login route here
router.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    res.status(500).json(err);
  }
});

// add a get /signup route here
router.get("/signup", (req, res) => {
  try {
    res.render("signup");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post to login
router.post("/login", async (req, res) => {
  try {
    // Search the DB for a user with the provided email
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      // Error message if no user is found
      res.status(404).json({ message: "Login failed. Please try again!" });
      return;
    }

    // Use `bcrypt.compare()` to compare the provided password and the hashed password
    const validPassword = await bcrypt.compare(
      req.body.password,
      userData.password
    );

    // If passwords do not match, return error message
    if (!validPassword) {
      res.status(400).json({ message: "Login failed. Please try again!!" });
      return;
    }

    // If passwords do match, save session and redirect to page-one
    req.session.save(() => {
      req.session.user_id = userData.id; // Store user ID in session
      req.session.logged_in = true; // Set logged_in to true
      console.log("Session data after login:", req.session);
      res.redirect("/pageOne"); // Redirect to the desired page
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/signup", async (req, res) => {

  console.log('attempting to create user');
  console.log(req.body);

  try {
    const newUser = await User.create({
      email: req.body.email,
      username: req.body.username, // If your form includes a username
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

    });
    res.status(200).json(newUser);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
