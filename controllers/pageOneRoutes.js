const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// Import the models
const { Playlist, MusicData } = require('../models');

// Protects routes from unauthorized access
const { withGuard } = require('../utils/authGuard');

// Load JSON data
const jsonFilePath = path.join(__dirname, '../seeds/musicData.json');
const songData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

router.get("/", withGuard, async (req, res) => {
  try {
    // Fetch all playlists for the logged-in user
    const playlistsData = await Playlist.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [{ model: MusicData }],
    });

    // Map playlists to a plain object to pass to Handlebars
    const playlists = playlistsData.map((playlist) => {
      return {
        id: playlist.id,
        name: playlist.name,
        songs: playlist.MusicData.map(song => ({
          id: song.id,
          name: song.TrackName,
          artist: song.ArtistName,
          album: song.AlbumName,
          duration: (song.TrackDuration / 60000).toFixed(2), // Convert ms to minutes
        })),
      };
    });

    // Process JSON data to get popular songs
    const popularSongs = songData.map(song => ({
      id: song.id,
      title: song.TrackName,
      artist: song.ArtistName,
      album: song.AlbumName,
      dateReleased: song.AlbumReleaseDate,
      duration: (song.TrackDuration / 60000).toFixed(2) // Convert ms to minutes
    }));

    // Pass data to the Handlebars template
    res.render("page-one", {
      loggedIn: req.session.logged_in,
      playlists,
      popularSongs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
