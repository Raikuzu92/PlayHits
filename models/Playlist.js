const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Define the Playlist model
class Playlist extends Model { }

// Initialize the Playlist model
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
    user_id: { // Corrected to 'user_id' to match the column name
      type: DataTypes.INTEGER,
      allowNull: false,
    }
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
    modelName: 'playlist',

    hooks: {
      beforeCreate: async (playlist, session) => {
        const userId = session.user_id || 1; // Default userId if not provided
        console.log("User ID:", userId);
        playlist.user_id = userId;
      },
    },
  }
);

// Add a hook to run before creating a Playlist

module.exports = Playlist;