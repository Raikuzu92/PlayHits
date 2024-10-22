const router = require("express").Router();
const fs = require("fs");
const path = require("path");

// Import the models
const { Playlist, Song } = require("../models");

// Protects routes from unauthorized access
const { withGuard } = require("../utils/authGuard");

// Display playlists and popular songs as soon as the page loads
router.get("/", withGuard, async (req, res) => {
  try {
    // Fetch all playlists for the logged-in user
    const playlistsData = await Playlist.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [{ model: Song }],
    });
    // Map playlists to a plain object to pass to Handlebars
    const playlists = playlistsData.map((playlist) => {
      return {
        id: playlist.id,
        name: playlist.title,
        songs: playlist.Songs
          ? playlist.Songs.map((song) => {
              const totalSeconds = Math.floor(song.track_duration_ms / 1000); // Convert ms to seconds
              const minutes = Math.floor(totalSeconds / 60); // Get whole minutes
              const seconds = totalSeconds % 60; // Get the remainder seconds
              return {
                id: song.id,
                name: song.track_name,
                artist: song.artist_name,
                album: song.album_name,
                duration: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`, // Convert ms to minutes
              };
            })
          : [],
      };
    });

    // Fetch popular songs from the database instead of JSON
    const popularSongsData = await Song.findAll();
    const popularSongs = popularSongsData
      .filter((song) => song.popularity) // Filter out songs without a popularity score
      .sort((a, b) => b.popularity - a.popularity) // Sort by popularity in descending order
      .map((song) => {
        const totalSeconds = Math.floor(song.track_duration_ms / 1000); // Convert ms to seconds
        const minutes = Math.floor(totalSeconds / 60); // Get whole minutes
        const seconds = totalSeconds % 60; // Get the remainder seconds
        return {
          id: song.id,
          title: song.track_name,
          artist: song.artist_name,
          album: song.album_name,
          dateReleased: song.album_release_date,
          duration: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`, // Convert ms to minutes
        };
      });

    // Slice the array to only include the first 10 songs
    const topTenSongs = popularSongs.slice(0, 10);
    console.log(topTenSongs);
    // Pass data to the Handlebars template
    res.render("page-one", {
      loggedIn: req.session.logged_in,
      playlists: playlists,
      songs: topTenSongs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Display songs when user searches for
router.get("/search", withGuard, async (req, res) => {
  try {
    const searchTerm = req.query.query ? req.query.query.toLowerCase() : "";
    let filteredData = [];

    if (searchTerm) {
      // Fetch all songs for the logged-in user
      const songsData = await Song.findAll();
      // Filter songs based on the search term
      const filteredSongs = songsData.filter(
        (song) =>
          song.track_name && song.track_name.toLowerCase().includes(searchTerm)
      );

      // Process JSON data to get filtered songs
      filteredData = filteredSongs.map((song) => {
        const totalSeconds = Math.floor(song.track_duration_ms / 1000); // Convert ms to seconds
        const minutes = Math.floor(totalSeconds / 60); // Get whole minutes
        const seconds = totalSeconds % 60; // Get the remainder seconds
        return {
          id: song.id,
          title: song.track_name,
          artist: song.artist_name,
          album: song.album_name,
          dateReleased: song.album_release_date,
          duration: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`, // Convert ms to minutes
        };
      });
    } else {
      // Fetch all songs for the logged-in user (or globally, depending on your use case)
      const popularSongsData = await Song.findAll();

      // Process JSON data to get popular songs
      const popularSongs = popularSongsData
        .filter((song) => song.popularity) // Filter out songs without a popularity score
        .sort((a, b) => b.popularity - a.popularity) // Sort by popularity in descending order
        .map((song) => {
          const totalSeconds = Math.floor(song.track_duration_ms / 1000); // Convert ms to seconds
          const minutes = Math.floor(totalSeconds / 60); // Get whole minutes
          const seconds = totalSeconds % 60; // Get the remainder seconds
          return {
            id: song.id,
            title: song.track_name,
            artist: song.artist_name,
            album: song.album_name,
            dateReleased: song.album_release_date,
            duration: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`, // Convert ms to minutes
          };
        });

      // Limit the list to the first 10 popular songs
      filteredData = popularSongs.slice(0, 10);
    }

    // Fetch all playlists for the logged-in user
    const playlistsData = await Playlist.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [{ model: Song }],
    });

    // Map playlists to a plain object to pass to Handlebars
    const playlists = playlistsData.map((playlist) => {
      return {
        id: playlist.id,
        name: playlist.title,
        songs: playlist.Songs
          ? playlist.Songs.map((song) => {
              const totalSeconds = Math.floor(song.track_duration_ms / 1000); // Convert ms to seconds
              const minutes = Math.floor(totalSeconds / 60); // Get whole minutes
              const seconds = totalSeconds % 60; // Get the remainder seconds
              return {
                id: song.id,
                name: song.track_name,
                artist: song.artist_name,
                album: song.album_name,
                duration: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`, // Convert ms to minutes
              };
            })
          : [],
      };
    });

    // Pass data to the Handlebars template
    res.json({
      loggedIn: req.session.logged_in,
      songs: filteredData,
      playlists: playlists,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
module.exports = router;
