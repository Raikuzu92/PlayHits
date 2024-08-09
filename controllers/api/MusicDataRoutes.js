const router = require("express").Router();

// import any models you plan to use for this data's routes here
const { MusicData } = require("../../models");

// protects routes from non-logged in users
const { apiGuard } = require("../../utils/authGuard");
//tested in insomnia !!!
router.get('/', async (req, res) => {
  try {
    const musicDataList = await MusicData.findAll({});
    
    res.json(musicDataList);  // Return the fetched data
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



//tested in insomnia !!!
router.post("/",  async (req, res) => {
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
