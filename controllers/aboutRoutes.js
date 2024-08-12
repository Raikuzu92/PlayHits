const router = require("express").Router();

// Import any models you plan to use for data's routes here
// If you would like to use an authGuard middleware, import it here
// add a get / (landing page) route here
router.get("/", async (req, res) => {
  try {
    // Reminder- We're passing the examples data to the home handlebars template here!
    // Reminder- We're also passing the loggedIn status to the home template here so that we can conditionally render items if the user is logged in or not (like we do with the navbar using `{{if loggedIn}}`).
    res.render("aboutUs", {
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
