angular.module("app.playlist_edit", []).controller('Playlist_editController', function ($stateParams, $state, $location, $window, AuthenticationService, Tracks, Playlists, Templates) {
  var self = this;
  var playing = false; // If music is playing or not

  // TODO: do we want to sanitize this?
  this.id = $stateParams.id;
  if ($state.current.name === 'playlist-new-edit') {
    // We're creating a new playlist!
    self.newPlaylist = true;
  }

  this.title = "Add a Ride";
  this.playlist = Playlists.getPlaylist();
  this.tracks = Tracks.getTracks();
  this.currentgoal = Playlists.getCurrentGoal();
  this.playlistTracksLength = 0;
  self.showErrors = false; // TODO: Don't show errors until this is designed
  this.error = {
    error: false,
    trackLengthTooShort: false,
    trackLengthTooLong: false
  };

  Playlists.setStep(2);

  // Load tracks from the user's default genre selection
  Tracks.loadUserGenresTracks().then(function (data) {
    self.tracks = data;
  });

  // Create new playlist
  if ($location.path().substring(0, 15) === '/playlists/new/') {
    Templates.loadTemplate(self.id).then(function (data) {
      self.playlist = Playlists.createNewPlaylistFromTemplate(data);
      self.currentgoal = Playlists.getCurrentGoal();
    });
  } else if (self.id) {
    // Load an existing playlist so we can edit it
    Playlists.loadPlaylist(this.id).then(function () {
      self.playlist = Playlists.getPlaylist();
      self.playlistTracksLength = Playlists.getPlaylistLength();
      self.currentgoal = Playlists.getCurrentGoal();
      if (checkPlaylistLength() === false) {
        self.newPlaylist = true;
      }
    });
  }

  this.playTrack = function (track) {
    Tracks.playTrack(track);
  };

  /**
   * The user has just clicked on a goal; potentially open/close it and make it active/inactive
   * @param goal
   */
  this.goalClicked = function (playlistGoal) {
    // User has clicked on an open, unselected goal, so don't collapse it
    if (playlistGoal.show) {
      // Collapse this open and selected goal
      /* Jacky asked for this not to happen any more
      if (self.currentgoal.PlaylistGoalId === playlistGoal.Id) {
        //playlistGoal.show = !playlistGoal.show;
      }
      */
    } else {
      playlistGoal.show = !playlistGoal.show;
    }

    Playlists.setCurrentGoal(playlistGoal);
    // Why isn't this automatically happening due to setting this earlier? i.e. this isn't data bound...
    self.currentgoal = Playlists.getCurrentGoal();
  };

  /**
   * Is this an active goal?
   * @param goal
   * @returns {boolean}
   */
  this.isGoalActive = function (playlistGoal) {
    if (playlistGoal.show === true && self.currentgoal.PlaylistGoalId === playlistGoal.Id) {
      return true;
    }
    return false;
  };

  this.trackSearch = function () {
    Tracks.searchTracks(self.search).then(function (data) {
      self.tracks = data;
    });
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

    Playlists.trackDropped(self.currentgoal.ArrayId, track);
    this.playlistTracksLength = Playlists.getPlaylistLength();
  };

  // Remove a track from a goal playlist
  this.removeTrack = function (playlistGoalArrayId, track) {
    Playlists.removeTrackFromGoalPlaylist(playlistGoalArrayId, track);
    this.playlistTracksLength = Playlists.getPlaylistLength();

    // The track isn't "dropped" any more
    var bin = document.getElementById("bin" + playlistGoalArrayId);
    if (bin) {
      bin.classList.remove('dropped');
      bin.setAttribute('droppable', '');
    }
  };

  // If the playlist goal note doesn't exist, create it
  this.playlistGoalNoteCreate = function (playlistGoalArrayId, trackIndex) {
    var noteText = self.playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalNotes[trackIndex].NoteText;
    var trackId = self.playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalTracks[trackIndex].TrackId;
    self.playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalNotes[trackIndex] = Playlists.createPlaylistGoalNote(noteText, trackId);
  };

  // Save the playlist to the API
  this.savePlaylist = function () {
    // TODO: not doing error checking for now
    /*
    if (!checkPlaylistLength()) {
      return;
    }
    */
    self.playlist.put({
      syncPlaylist: false
    }).then(function () {
      if (self.newPlaylist) {
        // New playlist view
        $state.go('playlist-new-view', {
          id: self.playlist.Id
        });
      } else {
        // TODO: Add a playlist view state and go to it
        $state.go('playlist-view', {
          id: self.playlist.Id
        });
      }
    });
  };

  /**
   * Checks if the playlist length is within certain bounds.
   *
   * @return
   *   true, if playlist length is ok, else
   *   false
   */
  function checkPlaylistLength() {
    // Check that the total track length is acceptable
    var variance = 3 * 60;
    var classLengthSeconds = self.playlist.ClassLengthMinutes * 60;

    // Track length is too short
    if (self.playlistTracksLength < classLengthSeconds - variance) {
      // TODO: don't show errors until Lara has designed how this must look
      if (self.showErrors) {
        self.error = {
          error: true,
          trackLengthTooShort: true
        };
        $window.scrollTo(0, 0);
      }
      return false;
    }
    // Track length is too long
    else if (self.playlistTracksLength > classLengthSeconds + variance) {
      // TODO: don't show errors until Lara has designed how this must look
      if (self.showErrors) {
        self.error = {
          error: true,
          trackLengthTooLong: true
        };
        $window.scrollTo(0, 0);
      }
      return false;
    }
    return true;
  }

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
