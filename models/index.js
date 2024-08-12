// models/index.js

const User = require('./User');
const Playlist = require('./Playlist');
const Song = require('./MusicData');
const Category = require('./Category');

// A user can have multiple playlists
User.hasMany(Playlist, {
  foreignKey: 'user_id',
});

// A playlist belongs to one user
Playlist.belongsTo(User, {
  foreignKey: 'user_id',
});

// A playlist can have many songs
Playlist.hasMany(Song, {
  foreignKey: 'playlist_id',
});

// A song belongs to one playlist
Song.belongsTo(Playlist, {
  foreignKey: 'playlist_id',
});

// You can also add relationships for categories if needed
// A song can belong to many categories
Song.belongsToMany(Category, {
  through: 'SongCategory',
  foreignKey: 'song_id',
});

// A category can have many songs
Category.belongsToMany(Song, {
  through: 'SongCategory',
  foreignKey: 'category_id',
});

module.exports = { User, Playlist, Song, Category };
