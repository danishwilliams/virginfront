/**
 * Created by rogersaner on 15/09/07.
 */
angular.module("app").factory('PlaylistService', function (TracksService) {
  // An array of goal playlists. Each goal playlist contains an array of tracks.
  var playlist = [];

  return {
    // This sets up a new structure to track goals; no tracks added yet
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

    // Add a track to a playlist for a goal id
    addtrackToGoalPlaylist: function (id, track) {
      // Replaces any existing track in the playlist
      playlist[id] = [];
      playlist[id].push(track);
    },

    // Removes a track from a playlist for a goal id
    removetrackFromGoalPlaylist: function (id, track) {
      playlist[id] = _.filter(playlist[id], function (val) {
        if (val.id === track.id) {
          return false;
        }
        return true;
      });
    },

    // A track has been added to a goal
    trackDropped: function(goalid, track) {
      // Update the playlist
      this.addtrackToGoalPlaylist(goalid, track);
    }
  };
});