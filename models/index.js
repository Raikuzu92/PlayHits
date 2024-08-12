// models/index.js

const User = require('./User');
const Playlist = require('./Playlist');
const Song = require('./Song');


// A user can have multiple playlists
User.hasMany(Playlist, {
  foreignKey: 'user_id',
});

// A playlist belongs to one user
Playlist.belongsTo(User, {
  foreignKey: 'user_id',
});

// A playlist can have many songs
Playlist.belongsToMany(Song, {
  through: 'PlaylistSongs',
});

// A song belongs to one playlist
Song.belongsToMany(Playlist, {
  through: 'PlaylistSongs',
});



module.exports = { User, Playlist, Song };
