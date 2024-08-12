const sequelize = require("../config/connection");

// Reminder- import any models you want to seed here
const { Song } = require("../models");

// Reminder- import any data you want to seed here
const musicData = require("./musicData.json");
const userData = require("./userData.json");

const seedDatabase = async () => {
  // sync all models
  await sequelize.sync({ force: true });
  console.log("Sequelize synced");

  // bulkCreate music data
  await Song.bulkCreate(musicData, {
    individualHooks: true,
    returning: true,
  });
  console.log("Song data created");

  // Reminder- add any other models you want to seed here

  process.exit(0);
};

seedDatabase();
