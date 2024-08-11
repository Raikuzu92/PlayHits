// routes/pageOneRoutes.js

const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { Playlist, Song, Category } = require("../models");
const { withGuard } = require("../utils/authGuard");

const jsonFilePath = path.join(__dirname, '../seeds/musicData.json');
const songData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

router.get("/", withGuard, async (req, res) => {
  try {
    // Fetch the user's playlists
    const userPlaylists = await Playlist.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [Song],
    });

    const playlists = userPlaylists.map((playlist) =>
      playlist.get({ plain: true })
    );

    // Fetch trending songs
    const trendingSongs = songData.slice(0, 10).map(song => ({
      image: song['Album Image URL'],
      title: song['Track Name'],
      artist: song['Artist Name(s)'],
      genre: song['Artist Genres'],
      duration: (song['Track Duration (ms)'] / 60000).toFixed(2)
    }));

    // Fetch popular categories
    const categories = ['Inspiring', 'Happy', 'Fun', 'Hip Hop', 'Cinematic', 'Chill', 'Calm', 'Upbeat', 'Hopeful', 'Electronic'];

    // Render the data to the page-one template
    res.render("page-one", {
      loggedIn: req.session.logged_in,
      playlists,
      trendingSongs,
      categories
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
