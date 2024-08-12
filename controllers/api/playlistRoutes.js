const router = require("express").Router();

const { Playlist } = require("../../models");

const { apiGuard } = require("../../utils/authGuard");

router.get('/',  async (req, res) => {
    try {
      const playlists = await Playlist.findAll({});
      
      res.json(playlists);  // Return the fetched data
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.post('/',  async (req, res) => {
    try {
        const newPlaylist = Playlist.create(req.body)

        // Redirect to playlists page
        res.status(200).json(newPlaylist);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);  
    }
});

router.post('/playlists/:id/add-song', apiGuard, async (req, res) => {
  try {
    // Step 1: Create or find a song
    const songData = {
      title: 'New Song',
      artist: 'Artist Name'
    };
    const newSong = await Song.create(songData);

    // Step 2: Find the playlist by its ID
    const playlistId = 1; // Replace with your playlist ID
    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
      console.error('Playlist not found');
      return;
    }

    // Step 3: Add the new song to the playlist
    await playlist.addSong(newSong);
    console.log('Song added to playlist successfully');

  } catch (error) {
    console.error('Error adding song to playlist:', error);
  }
});

  module.exports = router;