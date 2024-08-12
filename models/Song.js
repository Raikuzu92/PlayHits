// Third-party Modules
const { Model, DataTypes } = require("sequelize");

// Local Modules
const sequelize = require("../config/connection");

class Song extends Model {}

Song.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    track_uri: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    track_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    artist_uri: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Adjusted to handle multiple URIs
      allowNull: true,
    },
    artist_name: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Adjusted to handle multiple names
      allowNull: true,
    },
    album_uri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    album_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    album_artist_uri: {
      type: DataTypes.ARRAY(DataTypes.STRING(1000)), // Adjusted to handle multiple URIs
      allowNull: true,
    },
    album_artist_name: {
      type: DataTypes.ARRAY(DataTypes.STRING(1000)), // Adjusted to handle multiple names
      allowNull: true,
    },
    album_release_date: {
      type: DataTypes.DATEONLY, // For dates without time
      allowNull: true,
    },
    album_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disc_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    track_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    track_duration_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    track_preview_url: {
      type: DataTypes.STRING,
      allowNull: true, // This can be null if no preview URL is provided
    },
    explicit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    popularity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isrc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    added_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    added_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    artist_genres: {
      type: DataTypes.TEXT, // Store as a comma-separated string
      allowNull: true, // This can be null if no genres are available
    },
    album_genres: {
      type: DataTypes.STRING, // Store as a comma-separated string
      allowNull: true, // This can be null if no genres are available
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true, // This can be null if no label is provided
    },
    copyrights: {
      type: DataTypes.TEXT,
      allowNull: true, // This can be null if no copyright info is provided
    },
    danceability: {
      type: DataTypes.FLOAT,
      allowNull: true, // This can be null if not provided
    },
    energy: {
      type: DataTypes.FLOAT,
      allowNull: true, // This can be null if not provided
    },
    key: {
      type: DataTypes.INTEGER,
      allowNull: true, // This can be null if not provided
    },
    loudness: {
      type: DataTypes.FLOAT,
      allowNull: true, // This can be null if not provided
    },
    mode: {
      type: DataTypes.INTEGER,
      allowNull: true, // This can be null if not provided
    },
    speechiness: {
      type: DataTypes.FLOAT,
      allowNull: true, // This can be null if not provided
    },
    acousticness: {
      type: DataTypes.FLOAT,
      allowNull: true, // This can be null if not provided
    },
    instrumentalness: {
      type: DataTypes.FLOAT,
      allowNull: true, // This can be null if not provided
    },
    liveness: {
      type: DataTypes.FLOAT,
      allowNull: true, // This can be null if not provided
    },
    valence: {
      type: DataTypes.FLOAT,
      allowNull: true, // This can be null if not provided
    },
    tempo: {
      type: DataTypes.FLOAT,
      allowNull: true, // This can be null if not provided
    },
    time_signature: {
      type: DataTypes.INTEGER,
      allowNull: true, // This can be null if not provided
    },
  },

  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "song",
  }
);

module.exports = Song;
