// import all models here
const User = require("./User");
const MusicData = require("./MusicData");

// Reminder- create any additional associations here
// MusicData.belongsTo(User, {
//   foreignKey: "user_id",
//   onDelete: "CASCADE",
// });

// User.hasMany(MusicData, {
//   foreignKey: "user_id",
// });

// export all models here
module.exports = { User, MusicData };
