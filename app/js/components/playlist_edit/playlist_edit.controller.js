angular.module("app.playlist_edit", []).controller('Playlist_editController', function ($stateParams, $state, $rootScope, $location, $document, AuthenticationService, Tracks, Playlists, Templates) {
  var self = this;
  var playing = false; // If music is playing or not

  // TODO: do we want to sanitize this?
  this.id = $stateParams.id;
  self.title = "Edit your playlist";
  if (Playlists.getCreatingNewPlaylist() || $state.current.name === 'playlist-new-edit') {
    // We're creating a new playlist!
    Playlists.setCreatingNewPlaylist(true);
    self.newPlaylist = true;
    self.title = "Create your playlist";
  }

  this.playlist = Playlists.getPlaylist();
  this.currentgoal = Playlists.getCurrentGoal();
  this.playlistTracksLength = 0;

  Playlists.setStep(2);

  $rootScope.$on('$stateChangeSuccess', function () {
    if ($state.current.name === 'playlist-edit' || $state.current.name === 'playlist-new-edit') {
      // User has just selected a track from track search to add to a goal
      var track = Tracks.getSearchedTrack();
      if (!_.isEmpty(track)) {
        Playlists.trackDropped(self.currentgoal.ArrayId, track);
        self.playlistTracksLength = Playlists.getPlaylistLength();
        self.checkAllGoalsHaveTracks();
        Tracks.setSearchedTrack({});
      }
      angular.element($document[0].body).removeClass('noscroll');
    }
  });

  // Create new playlist
  if (self.newPlaylist) {
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
      if (self.checkPlaylistLength() === false) {
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
    if (playlistGoal.show) {
      // User has clicked on an open goal

      if (playlistGoal.PlaylistGoalTracks.length > 0) {
        // Collapse this open goal
        playlistGoal.show = !playlistGoal.show;
      }
    } else {
      playlistGoal.show = !playlistGoal.show;
    }

    Playlists.setCurrentGoal(playlistGoal);
    // Why isn't this automatically happening due to setting this earlier? i.e. this isn't data bound...
    self.currentgoal = Playlists.getCurrentGoal();

    // If there aren't any tracks, find some!
    if (playlistGoal.PlaylistGoalTracks.length === 0) {
      angular.element($document[0].body).addClass('noscroll');
      if (self.newPlaylist) {
        $state.go('playlist-new-edit.tracks-search');
      }
      else {
        $state.go('playlist-edit.tracks-search');
      }
    }
  };

  /**
   * Is this an active goal?
   * @param goal
   * @returns {boolean}
   */
  this.isGoalActive = function (playlistGoal) {
    if (self.currentgoal.PlaylistGoalId === playlistGoal.Id) {
      return true;
    }
    return false;
  };

  // Remove a track from a goal playlist
  this.removeTrack = function (playlistGoalArrayId, track) {
    Playlists.removeTrackFromGoalPlaylist(playlistGoalArrayId, track);
    this.playlistTracksLength = Playlists.getPlaylistLength();
    self.checkAllGoalsHaveTracks();
    Tracks.stopTrack(track.Track);

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
    if (!self.newPlaylist && !self.checkAllGoalsHaveTracks()) {
      // Probably hit 'enter' in the ride name inputbox
      return;
    }
    if (self.checkAllGoalsHaveTracks()) {
      self.playlist.Complete = true;
    } else {
      self.playlist.Complete = false;
    }

    Playlists.setCreatingNewPlaylist(false);

    self.playlist.put({
      syncPlaylist: false
    }).then(function () {
      if (!self.checkAllGoalsHaveTracks() || !self.checkPlaylistLength()) {
        $state.go('dashboard');
      } else if (self.newPlaylist) {
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
   * Does every goal have a track?
   */
  this.checkAllGoalsHaveTracks = function () {
    return Playlists.checkAllGoalsHaveTracks();
  };

  this.checkPlaylistLength = function () {
    return Playlists.checkPlaylistLength();
  };

  /* Hide the submit button if we're editing a playlist and not every goal has a track */
  this.checkWhenEditingEveryGoalHasATrack = function () {
    if (!self.newPlaylist) {
      if (!self.checkAllGoalsHaveTracks()) {
        return false;
      }
    }
    return true;
  };

  this.submitButtonText = function () {
    if (!self.newPlaylist && !self.checkAllGoalsHaveTracks()) {
      // Editing a playlist but not all tracks have goals
      return 'Each goal needs a track';
    } else if (!self.checkAllGoalsHaveTracks() || !self.checkPlaylistLength()) {
      return 'Save and continue later';
    }
    if (self.newPlaylist) {
      return 'Next: preview my ride';
    }
    return 'Update changes';
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
