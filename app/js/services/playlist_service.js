/**
 * Created by rogersaner on 15/09/07.
 */
angular.module("app").factory('PlaylistService', function (PlaylistFactory) {
  return {
    // This sets up a new structure to track goals; no tracks added yet
    // TODO: this needs to be refactored to accept another argument, a goal id,
    // so that we can have multiple goal playlists, not just one
    setupEmptyPlaylist: function (goals_data) {
      goals_data.forEach(function (value) {
        PlaylistFactory.playlist.push([]);
      });
    },

    // Returns the playlist for a specific goal
    getGoalPlaylist: function (id) {
      return PlaylistFactory.playlist[id];
    },

    // Returns the entire playlist
    getPlaylist: function () {
      return PlaylistFactory.playlist;
    },

    // Add a track to a playlist for a goal id
    addTrackToGoalPlaylist: function (id, track) {
      // Replaces any existing track in the playlist
      PlaylistFactory.playlist[id] = [];
      PlaylistFactory.playlist[id].push(track);
    },

    // Removes a track from a playlist for a goal id
    removeTrackFromGoalPlaylist: function (id, track) {
      PlaylistFactory.playlist[id] = _.filter(PlaylistFactory.playlist[id], function (val) {
        if (val.id === track.id) {
          return false;
        }
        return true;
      });
    },

    // A track has been added to a goal
    trackDropped: function(goalid, track) {
      // Update the playlist
      this.addTrackToGoalPlaylist(goalid, track);
    }
  };
});

angular.module("app").factory('PlaylistFactory', function() {
  // An array of goal playlists. Each goal playlist contains an array of tracks.
  return {
    playlist: []
  };
});
