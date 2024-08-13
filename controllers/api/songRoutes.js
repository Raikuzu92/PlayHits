const router = require("express").Router();

// import any models you plan to use for this data's routes here
const { Song } = require("../../models");

// protects routes from non-logged in users
const { apiGuard } = require("../../utils/authGuard");
//tested in insomnia !!!
router.get("/", async (req, res) => {
  try {
    const musicDataList = await Song.findAll({});

    res.json(musicDataList); // Return the fetched data
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Route to get a specific song by its ID
router.get("/:id", async (req, res) => {
  try {
    const songId = req.params.id; // Get the songId from the request parameters
    const songData = await Song.findOne({
      where: {
        id: songId,
      },
    });

    if (!songData) {
      res.status(404).json({ message: "Song not found" });
      return;
    }

    res.json(songData); // Return the song data as a JSON response
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//tested in insomnia !!!
router.post("/", apiGuard, async (req, res) => {
  try {
    const newMusicData = await MusicData.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.json(newMusicData);
  } catch (err) {
    res.status(500).json(err);
  }
});
//tested in insomnia
router.put("/:id", apiGuard, async (req, res) => {
  try {
    const [updatedRows] = await MusicData.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updatedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//tested in insomnia!!!
router.delete("/:id", apiGuard, async (req, res) => {
  try {
    const [destroyedRows] = MusicData.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (destroyedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
