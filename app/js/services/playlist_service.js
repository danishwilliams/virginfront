/**
 * Created by rogersaner on 15/09/07.
 */
angular.module("app").factory('PlaylistService', function (SongsService) {
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
      // Replaces any existing song in the playlist
      playlist[id] = [];
      playlist[id].push(song);
    },

    // Removes a song from a playlist for a goal id
    removeSongFromGoalPlaylist: function (id, song) {
      playlist[id] = _.filter(playlist[id], function (val) {
        if (val.id === song.id) {
          return false;
        }
        return true;
      });
    },

    // A song has been added to a goal
    songDropped: function(goalid, song) {
      // Update the playlist
      this.addSongToGoalPlaylist(goalid, song);
    }
  };
});