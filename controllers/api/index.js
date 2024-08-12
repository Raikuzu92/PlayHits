const router = require("express").Router();

// Import all of the routes from /api/ here
const userRoutes = require("./userRoutes");
const musicDataRoutes = require("./musicDataRoutes");

// Connect the routes to the router here
router.use("/users", userRoutes);
router.use("/musicData", musicDataRoutes);

module.exports = router;
