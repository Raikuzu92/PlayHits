// Third-party Modules
const { Model, DataTypes } = require("sequelize");

// Local Modules
const sequelize = require("../config/connection");

class MusicData extends Model {}

MusicData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
   
    // Reminder- Add any new columns to the ExampleData model here
      track_uri: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      track_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      artist_uri: {
        type: DataTypes.STRING, // Adjust if multiple URIs should be handled differently
        allowNull: false
      },
      artist_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      album_uri: {
        type: DataTypes.STRING,
        allowNull: false
      },
      album_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      album_artist_uri: {
        type: DataTypes.STRING, // Adjust if multiple URIs should be handled differently
        allowNull: false
      },
      album_artist_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      album_release_date: {
        type: DataTypes.DATEONLY, // For dates without time
        allowNull: false
      },
      album_image_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      disc_number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      track_number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      track_duration_ms: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      track_preview_url: {
        type: DataTypes.STRING,
        allowNull: true // This can be null if no preview URL is provided
      },
      explicit: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      popularity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isrc: {
        type: DataTypes.STRING,
        allowNull: false
      },
      added_by: {
        type: DataTypes.STRING,
        allowNull: false
      },
      added_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      artist_genres: {
        type: DataTypes.STRING, // Store as a comma-separated string
        allowNull: true // This can be null if no genres are available
      },
      album_genres: {
        type: DataTypes.STRING, // Store as a comma-separated string
        allowNull: true // This can be null if no genres are available
      },
      label: {
        type: DataTypes.STRING,
        allowNull: true // This can be null if no label is provided
      },
      copyrights: {
        type: DataTypes.STRING,
        allowNull: true // This can be null if no copyright info is provided
      },
      danceability: {
        type: DataTypes.FLOAT,
        allowNull: true // This can be null if not provided
      },
      energy: {
        type: DataTypes.FLOAT,
        allowNull: true // This can be null if not provided
      },
      key: {
        type: DataTypes.INTEGER,
        allowNull: true // This can be null if not provided
      },
      loudness: {
        type: DataTypes.FLOAT,
        allowNull: true // This can be null if not provided
      },
      mode: {
        type: DataTypes.INTEGER,
        allowNull: true // This can be null if not provided
      },
      speechiness: {
        type: DataTypes.FLOAT,
        allowNull: true // This can be null if not provided
      },
      acousticness: {
        type: DataTypes.FLOAT,
        allowNull: true // This can be null if not provided
      },
      instrumentalness: {
        type: DataTypes.FLOAT,
        allowNull: true // This can be null if not provided
      },
      liveness: {
        type: DataTypes.FLOAT,
        allowNull: true // This can be null if not provided
      },
      valence: {
        type: DataTypes.FLOAT,
        allowNull: true // This can be null if not provided
      },
      tempo: {
        type: DataTypes.FLOAT,
        allowNull: true // This can be null if not provided
      },
      time_signature: {
        type: DataTypes.INTEGER,
        allowNull: true // This can be null if not provided
      }
    },
  
  //////////////////////////////////////////////////////////////////
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "musicdata",
  }
);

module.exports = MusicData;
