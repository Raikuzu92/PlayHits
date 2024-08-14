const router = require("express").Router();
const { Playlist, Song } = require("../../models");
const { apiGuard } = require("../../utils/authGuard");

// Get all playlists
router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.findAll({
      include: [{ model: Song }],
    });
    res.status(200).json(playlists);
  } catch (err) {
    console.error("Error fetching playlists:", err);
    res.status(500).json({ error: "Error fetching playlists" });
  }
});

// Get a specific playlist by id
router.get("/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id, {
      include: [{ model: Song }],
    });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json(playlist);
  } catch (err) {
    console.error("Error fetching playlist:", err);
    res.status(500).json({ error: "Error fetching playlist" });
  }
});

// Create a new playlist
router.post("/", apiGuard, async (req, res) => {
  try {
    const newPlaylist = await Playlist.create({
      ...req.body,
      user_id: req.session.user_id, // Ensure user_id is taken from the session
    });
    res.status(201).json(newPlaylist);
  } catch (err) {
    console.error("Error creating playlist:", err);
    res.status(500).json({ error: "Error creating playlist" });
  }
});

// Add a song to a playlist by song ID
router.post("/:id/add-song", async (req, res) => {
  try {
    // Find the playlist by ID
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Find the song by ID
    const song = await Song.findByPk(req.body.songId);
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Add the song to the playlist
    await playlist.addSong(song);
    res.status(200).json({ message: "Song added to playlist successfully" });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    res.status(500).json({ error: "Error adding song to playlist" });
  }
});


// Remove a song from a playlist
router.delete("/:id/song/:songId", async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    const song = await Song.findByPk(req.params.songId);

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Remove the song from the playlist
    await playlist.removeSong(song);
    res.status(200).json({ message: "Song removed from playlist successfully" });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    res.status(500).json({ error: "Error removing song from playlist" });
  }
});

// Delete playlist
router.delete('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    await playlist.destroy();
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ error: 'Error deleting playlist' });
  }
});

module.exports = router;
