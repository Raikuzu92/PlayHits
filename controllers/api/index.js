const router = require("express").Router();

// Import all of the routes from /api/ here
const userRoutes = require("./userRoutes");
const songRoutes = require("./songRoutes");
const playlistRoutes = require("./playlistRoutes")

// Connect the routes to the router here
// router.use("/users", userRoutes);
router.use("/songData", songRoutes);
router.use("/playlists", playlistRoutes);

module.exports = router;
