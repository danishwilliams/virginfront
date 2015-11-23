angular.module("app.playlist_edit", []).controller('Playlist_editController', function ($stateParams, $state, $location, $window, $modal, AuthenticationService, Tracks, Playlists, Templates) {
  var self = this;
  var playing = false; // If music is playing or not

  // TODO: do we want to sanitize this?
  this.id = $stateParams.id;
  self.title = "Edit your playlist";
  if ($state.current.name === 'playlist-new-edit') {
    // We're creating a new playlist!
    self.newPlaylist = true;
    self.title = "Create your playlist";
  }

  this.playlist = Playlists.getPlaylist();
  this.currentgoal = Playlists.getCurrentGoal();
  this.playlistTracksLength = 0;

  Playlists.setStep(2);

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
      if (self.checkPlaylistLength() === false) {
        self.newPlaylist = true;
      }
    });
  }

  // Show the track search modeal
  this.showTracksModal = function (playlistGoal) {
    // User has clicked an unselected goal
    if (playlistGoal.Id !== self.currentgoal.PlaylistGoalId) {
      self.goalClicked(playlistGoal);
    }
    var modalInstance = $modal.open({
      templateUrl: '../js/components/tracks_search/tracks_search.html',
      controller: 'Tracks_searchController',
      controllerAs: 'vm',
      windowClass: 'tracks-modal',
      resolve: {
        goal: function () {
          return self.currentgoal;
        }
      }
    });

    modalInstance.result.then(function (track) {
      Playlists.trackDropped(self.currentgoal.ArrayId, track);
      this.playlistTracksLength = Playlists.getPlaylistLength();
      self.checkAllGoalsHaveTracks();
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
  };

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
      if (self.currentgoal.PlaylistGoalId === playlistGoal.Id) {
        playlistGoal.show = !playlistGoal.show;
      }
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
    return 'Next: preview my ride';
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
