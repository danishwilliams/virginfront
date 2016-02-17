angular.module("app.tracks_search", []).controller('Tracks_searchController', function ($state, $stateParams, Tracks, Playlists, spinnerService, Users) {
  var self = this;

  this.currentgoal = Playlists.getCurrentGoal();
  var isCustomRpm = Playlists.getPlaylistCustomRpm();
  this.tracks = Tracks.getTracks();
  self.error = {};

  if (this.currentgoal.BpmLow === -1) {
    $state.go('^');
  } else {
    // Load tracks from the user's default genre selection
    self.error = {};
    Tracks.loadUserGenresTracks(this.currentgoal.BpmLow, this.currentgoal.BpmHigh).then(function (data) {
      self.tracks = data;
      spinnerService.hide('trackSpinner');
    }, function () {
      spinnerService.hide('trackSpinner');
      self.error = {
        server: true
      };
    });
  }

  // Set up addition bpm range for non-UK (i.e. the playlist IsCustomRpm value is true)
  if (!this.currentgoal.BackgroundSection && !isCustomRpm) {
    // If bpm less than 90, then high range is doubled
    if (this.currentgoal.BpmLow < 90) {
      this.bpm2 = true;
      this.bpmLow2 = this.currentgoal.BpmLow * 2;
      this.bpmHigh2 = this.currentgoal.BpmHigh * 2;
    }
    // If bpm greater than 120, then halve it too
    else if (this.currentgoal.BpmLow >= 120) {
      this.bpm2 = true;
      this.bpmLow2 = this.currentgoal.BpmLow;
      this.bpmHigh2 = this.currentgoal.BpmHigh;
      this.currentgoal.BpmLow = this.currentgoal.BpmLow / 2;
      this.currentgoal.BpmHigh = this.currentgoal.BpmHigh / 2;
    }
  }

  this.cancel = function () {
    Tracks.stopTrack();
    $state.go('^');
  };

  this.trackSearch = function () {
    spinnerService.show('trackSpinner');
    self.tracks = [];
    self.error = {};
    Tracks.searchTracks(self.search).then(function (data) {
      self.tracks = data;
      spinnerService.hide('trackSpinner');
    }, function () {
      spinnerService.hide('trackSpinner');
      self.error = {
        server: true
      };
    });
  };

  this.genreSearch = function () {
    var genres = [];
    self.genres.forEach(function (val) {
      if (val.selected) {
        genres.push({
          Id: val.Id
        });
      }
    });
    if (!_.isEmpty(genres)) {
      spinnerService.show('trackSpinner');
      self.tracks = [];
      self.error = {};
      Tracks.loadUserGenresTracks(this.currentgoal.BpmLow, this.currentgoal.BpmHigh, genres).then(function (data) {
        self.tracks = data;
        spinnerService.hide('trackSpinner');
      }, function () {
        spinnerService.hide('trackSpinner');
        self.error = {
          server: true
        };
      });
    }
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

    // If there are already tracks in the goal don't add one
    if (self.currentgoal.ArrayId) {
      var tracks = Playlists.getPlaylistGoalTracks(self.currentgoal.ArrayId);
      if (tracks.length > 0) {
        return;
      }
    }

    // Close the modal, and send the chosen track back to the playlist_edit controller
    Tracks.setSearchedTrack(track);
    $state.go('^');
  };
});
