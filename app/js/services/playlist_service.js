/**
 * Created by rogersaner on 15/09/07.
 */
angular.module("app").factory('PlaylistService', function () {
  // An array of goal playlists. Each goal playlist contains an array of songs.
  var playlist = [];

  return {
    // This sets up a new structure to track goals; no songs added yet
    // TODO: this needs to be refactored to accept another argument, a goal id,
    // so that we can have multiple goal playlists, not just one
    setupEmptyPlaylist: function (goals_data) {
      goals_data.forEach(function (value) {
        playlist.push([]);
      });
    },

    // Returns the playlist for a specific goal
    getGoalPlaylist: function (id) {
      return playlist[id];
    },

    // Returns the entire playlist
    getPlaylist: function () {
      return playlist;
    },

    // Add a song to a playlist for a goal id
    addSongToGoalPlaylist: function (id, song) {
      playlist[id].push(song);
    },

    // Removes a song from a playlist for a goal id
    removeSongFromGoalPlaylist: function (id, songid) {
      playlist[id] = _.filter(playlist[id], function (val) {
        if (val.id === songid) {
          return false;
        }
        return true;
      });
    }
  };
});