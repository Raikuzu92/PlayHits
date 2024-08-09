const router = require("express").Router();

// import any models you plan to use for this data's routes here
const { MusicData } = require("../../models");

// protects routes from non-logged in users
const { apiGuard } = require("../../utils/authGuard");

router.get('/', async (req, res) => {
  try {
    const MusicData = await MusicData.findAll({
      include: [
        {
          model: MusicData,
          attributes: ['track_name', 'Artist_Name', 'Album_Name', 'Album_Image_URL', 'Label'],
        },
      ],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});




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
