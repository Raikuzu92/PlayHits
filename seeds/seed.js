const sequelize = require("../config/connection");

// Reminder- import any models you want to seed here
const MusicData = require("../models/MusicData");

console.log("MusicData:", MusicData);

// Reminder- import any data you want to seed here
const musicData = require("./musicData.json");

const seedDatabase = async () => {
  // sync all models
  await sequelize.sync({ force: true });
  console.log("Sequelize synced");

  // bulkCreate Music data
  console.log(MusicData);
  await MusicData.bulkCreate(musicData, {
    individualHooks: true,
    returning: true,
  });
  console.log("Music data created");

  // Reminder- add any other models you want to seed here

  process.exit(0);
};

seedDatabase();
