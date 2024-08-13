const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Playlist extends Model {}

Playlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artist_name: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Adjusted to handle multiple names
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (playlist, session) => {
        const userId = session.user_id || 1; // Default userId if not provided
        console.log("User ID:", userId);
        playlist.user_id = userId;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "playlist",
  }
);

module.exports = Playlist;
