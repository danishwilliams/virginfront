angular.module("app.tracks_search", []).controller('Tracks_searchController', function ($state, $stateParams, Genres, Tracks, Playlists) {
  var self = this;

  this.currentgoal = Playlists.getCurrentGoal();
  this.tracks = Tracks.getTracks();

  if (this.currentgoal.BpmLow === 0) {
    $state.go('^');
  }

  // Set up addition bpm range
  if (this.currentgoal.BpmLow < 90) {
    this.bpm2 = true;
    this.bpmLow2 = this.currentgoal.BpmLow * 2;
    this.bpmHigh2 = this.currentgoal.BpmHigh * 2;
  }

  // Load tracks from the user's default genre selection
  Tracks.loadUserGenresTracks(this.currentgoal.BpmLow, this.currentgoal.BpmHigh).then(function (data) {
    self.tracks = data;
  });

  Genres.loadGenres().then(function (data) {
    self.genres = data;
  });

  this.cancel = function () {
    Tracks.stopTrack();
    $state.go('^');
  };

  this.trackSearch = function () {
    Tracks.searchTracks(self.search).then(function (data) {
      self.tracks = data;
    });
  };

  this.outOfBpmRange = function (bpm) {
    $in_range = false;
    if (self.bpm2 === true) {
      if ((bpm >= this.currentgoal.BpmLow && bpm <= this.currentgoal.BpmHigh) || (bpm >= self.bpmLow2 && bpm <= self.bpmHigh2)) {
        $in_range = true;
      }
    } else if (bpm >= this.currentgoal.BpmLow && bpm <= this.currentgoal.BpmHigh) {
      return $in_range;
    }
    return !$in_range;
  };

  this.playTrack = function (track) {
    Tracks.playTrack(track);
  };

  // Add a track to a goal self. If it passes our checks, call addTrackSuccess
  this.addTrack = function (track) {
    if (self.outOfBpmRange(track.Bpm)) {
      // TODO: show some kind of helpful error message to the user
      return;
    }

    // If there are already tracks don't add one
    var tracks = Playlists.getPlaylistGoalTracks(self.currentgoal.ArrayId);
    if (tracks.length > 0) {
      return;
    }

    // Close the modal, and send the chosen track back to the playlist_edit controller
    Tracks.setSearchedTrack(track);
    $state.go('^');
  };
});
