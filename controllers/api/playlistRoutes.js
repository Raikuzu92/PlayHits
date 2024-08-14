const router = require("express").Router();

const { Playlist, Song } = require("../../models");

const { apiGuard } = require("../../utils/authGuard");

router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.findAll({});

    res.json(playlists); // Return the fetched data
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const playlistData = await Playlist.findByPk(req.params.id, {
      // JOIN with locations, using the Trip through table
      include: [{ model: Song }],
    });
    if (!playlistData) {
      res.status(404).json({ message: "No traveller found with this id!" });
      return;
    }
    res.status(200).json(playlistData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", apiGuard, async (req, res) => {
  console.log(req.body + "--------------------------");
  try {
    const newPlaylist = await Playlist.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    // Redirect to playlists page
    res.status(200).json(newPlaylist);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/:id/add-song", async (req, res) => {
  try {
    // Step 1: Create or find a song
    const songData = {
      track_name: req.body.track_name,
      artist_name: req.body.artist_name,
    };
    const newSong = await Song.create(songData);

    // Step 2: Find the playlist by its ID from the request parameters
    const playlistId = req.params.id;
    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
      console.error("Playlist not found");
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Step 3: Add the new song to the playlist
    await playlist.addSong(newSong);
    console.log("Song added to playlist successfully");
    res.status(200).json({ message: "Song added to playlist successfully" });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    res.status(500).json({ error: "Error adding song to playlist" });
  }
});

// Delete song from playlist
router.delete("/:id/song/:songId", async (req, res) => {
  try {
    const playlistId = req.params.id;
    const songId = req.params.songId;

    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
      console.error("Playlist not found");
      return res.status(404).json({ error: "Playlist not found" });
    }
    const song = await Song.findByPk(songId);
    if (!song) {
      console.error("Song not found");
      return res.status(404).json({ error: "Song not found" });
    }

    await playlist.removeSong(song);

    console.log("Song successfully deleted from playlist");
    res
      .status(200)
      .json({ message: "Song successfully deleted from playlist" });
  } catch (error) {
    console.error("Error deleting song from playlist:", error);
    res.status(500).json({ error: "Error deleting song from playlist" });
  }
});

router.post("/:id/add-song", async (req, res) => {
  try {
    // Step 1: Find the song in your data
    const songData = {
      track_name: req.body.track_name,
      artist_name: req.body.artist_name,
    };
    
    const existingSong = await Song.findOne({
      where: songData,
    });

    if (!existingSong) {
      console.error("Song not found in your data");
      return res.status(404).json({ error: "Song not found in your data" });
    }

    // Step 2: Find the playlist by its ID from the request parameters
    const playlistId = req.params.id;
    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
      console.error("Playlist not found");
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Step 3: Add the existing song to the playlist
    await playlist.addSong(existingSong);
    console.log("Song added to playlist successfully");
    res.status(200).json({ message: "Song added to playlist successfully" });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    res.status(500).json({ error: "Error adding song to playlist" });
  }
});

module.exports = router;