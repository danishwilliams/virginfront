angular.module("app.tracks_search", []).controller('Tracks_searchController', function ($state, $stateParams, Tracks, Playlists, spinnerService, Users, Storage) {
  var self = this;

  this.currentgoal = Playlists.getCurrentGoal();
  var isCustomRpm = Playlists.getPlaylistCustomRpm();
  this.tracks = Tracks.getTracks();
  self.error = {};
  self.loadingTracks = true; // A request has been sent to the API to load some tracks, and it hasn't completed yet
  self.genre = Storage.getItem('genre');
  self.page = 0;  // For paginating the results

  if (this.currentgoal.BpmLow === -1) {
    $state.go('^');
  } else {
    self.error = {};
    if (self.genre) {
      // Load up a stored genre search
      loadUserGenresTracks();
    } else {
      // Load tracks from the user's default genre selection
      loadUserDefaultGenresTracks();
    }
  }

  function loadTracksFinished(error) {
    self.loadingTracks = false;
    if (error) {
      self.error = {
        server: true
      };
    }
    spinnerService.hide('trackSpinner');
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

  this.trackSearch = function (new_search) {
    if (new_search) {
      self.page = 0;
      self.tracks = [];
      self.error = {};
    }
    self.page++;
    self.loadingTracks = true;
    self.searching = true;
    spinnerService.show('trackSpinner');
    Tracks.searchTracks(self.search, self.page).then(loadTracksSuccess, loadTracksFailed);
  };

  this.genreSearch = function () {
    self.page = 0;
    if (!_.isEmpty(self.genres)) {
      self.tracks = [];
      self.error = {};
      loadUserGenresTracks();
    }
  };

  function loadTracksSuccess(data) {
    if (self.page === 1) {
      self.tracks = data;
    }
    else {
      self.tracks = self.tracks.concat(data);
    }
    loadTracksFinished();
  }

  function loadTracksFailed() {
    loadTracksFinished(true);
  }


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

    Tracks.stopTrack(track);
    track.loading = false;

    // Close the modal, and send the chosen track back to the playlist_edit controller
    Tracks.setSearchedTrack(track);
    $state.go('^');
  };

  self.loadMoreTracks = function () {
    if (self.loadingTracks) {
      return;
    }
    if (self.searching) {
       //console.log('another track search!');
       self.trackSearch();
    }
    else if (self.genre) {
      //console.log('loadUserGenresTracks');
      loadUserGenresTracks();
    } else {
      //console.log('loadUserDefaultGenresTracks');
      loadUserDefaultGenresTracks();
    }
  };

  // Load up a stored genre search
  function loadUserGenresTracks() {
    self.loadingTracks = true;
    self.searching = false;
    spinnerService.show('trackSpinner');
    var genres = [];
    if (self.genre !== 'All') {
      genres = [{
        Id: self.genre
      }];
    }
    self.page++;
    //console.log('page', self.page);
    Tracks.loadUserGenresTracks(self.currentgoal.BpmLow, self.currentgoal.BpmHigh, genres, self.page).then(loadTracksSuccess, loadTracksFailed);
  }

  // Load tracks from the user's default genre selection
  function loadUserDefaultGenresTracks() {
    self.loadingTracks = true;
    self.searching = false;
    spinnerService.show('trackSpinner');
    self.page++;
    //console.log('page', self.page);
    Tracks.loadUserDefaultGenresTracks(self.currentgoal.BpmLow, self.currentgoal.BpmHigh, self.page).then(loadTracksSuccess, loadTracksFailed);
  }
});
