angular.module("app.tracks_search", []).controller('Tracks_searchController', function ($scope, $modalInstance, goal, Tracks, Playlists) {
  var self = this;

  this.currentgoal = goal;
  this.tracks = Tracks.getTracks();

  // Load tracks from the user's default genre selection
  Tracks.loadUserGenresTracks().then(function (data) {
    self.tracks = data;
  });

  this.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  this.trackSearch = function () {
    Tracks.searchTracks(self.search).then(function (data) {
      self.tracks = data;
    });
  };

  this.outOfBpmRange = function (bpm) {
    if (bpm < this.currentgoal.BpmLow || bpm > this.currentgoal.BpmHigh) {
      return true;
    }
    return false;
  };

  this.playTrack = function (track) {
    Tracks.playTrack(track);
  };

  // Add a track to a goal self. If it passes our checks, call addTrackSuccess
  this.addTrack = function (track) {
    if (track.Bpm < self.currentgoal.BpmLow || track.Bpm > self.currentgoal.BpmHigh) {
      // TODO: show some kind of helpful error message to the user
      return;
    }

    // If there are already tracks don't add one
    var tracks = Playlists.getPlaylistGoalTracks(self.currentgoal.ArrayId);
    if (tracks.length > 0) {
      return;
    }

    // Close the modal, and send the chosen track back to the playlist_edit controller
    $modalInstance.close(track);
  };
});
