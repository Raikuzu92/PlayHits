const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Define the Playlist model
class Playlist extends Model {}

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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'playlist',
  }
);

// Add a hook to run before creating a Playlist
Playlist.addHook('beforeCreate', async (playlist, session) => {
  const userId = session.userId || 1; // Default userId if not provided
  playlist.userId = userId;
});

module.exports = Playlist;