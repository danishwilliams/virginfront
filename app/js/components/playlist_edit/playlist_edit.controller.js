angular.module("app.playlist_edit", []).controller('Playlist_editController', function ($stateParams, $location, AuthenticationService, Tracks, PlaylistEdit, Templates) {
  var self = this;
  var playing = false; // If music is playing or not

  // TODO: do we want to sanitize this?
  this.id = $stateParams.id;

  this.title = "Add a Ride";
  this.playlist = PlaylistEdit.getPlaylist();
  this.tracks = Tracks.getTracks();
  this.currentgoal = PlaylistEdit.getCurrentGoal();
  this.audio = new Audio(); // An audio object for playing a track
  this.audio.loop = true; // Because I'm not keeping track of how long a track is playing for

  PlaylistEdit.setStep(2);

  // Load tracks from the user's default genre selection
  Tracks.loadUserGenresTracks().then(function(data) {
    self.tracks = data;
  });

  // Create new playlist
  if ($location.path().substring(0, 15) === '/playlists/new/') {
    Templates.loadTemplate(self.id).then(function (data) {
      self.playlist = PlaylistEdit.createNewPlaylistFromTemplate(data);
      self.currentgoal = PlaylistEdit.getCurrentGoal();
    });
  } else if (self.id) {
    // Load an existing playlist so we can edit it
    PlaylistEdit.loadPlaylist(this.id).then(function () {
      self.playlist = PlaylistEdit.getPlaylist();
      self.currentgoal = PlaylistEdit.getCurrentGoal();
    });
  }

  this.playTrack = function (track) {
    console.log(track);
    if (self.currentPlayingTrack) {
      if (self.currentPlayingTrack.MusicProviderTrackId === track.MusicProviderTrackId) {
        if (track.playing === true) {
          // User has clicked pause i.e. the same track
          self.audio.pause();
          track.playing = false;
        }
        else {
          // User is playing a paused track
          self.audio.play();
          track.playing = true;
        }
        self.currentPlayingTrack = track;
      }
      else {
        track.playing = true;
        self.currentPlayingTrack.playing = false;
        self.currentPlayingTrack = track;
        self.audio.src = track.Source;
        self.audio.play();
      }
    }
    else {
      track.playing = true;
      self.currentPlayingTrack = track;
      self.audio.src = track.Source;
      self.audio.play();
    }
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

    PlaylistEdit.setCurrentGoal(playlistGoal);
    // Why isn't this automatically happening due to setting this earlier? i.e. this isn't data bound...
    self.currentgoal = PlaylistEdit.getCurrentGoal();
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

  this.trackSearch = function() {
    Tracks.searchTracks(self.search).then(function(data) {
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
    var tracks = PlaylistEdit.getPlaylistGoalTracks(self.currentgoal.ArrayId);
    if (tracks.length > 0) {
      return;
    }

    PlaylistEdit.trackDropped(self.currentgoal.ArrayId, track);
  };

  // Remove a track from a goal playlist
  this.removeTrack = function (playlistGoalArrayId, track) {
    PlaylistEdit.removeTrackFromGoalPlaylist(playlistGoalArrayId, track);

    // The track isn't "dropped" any more
    var bin = document.getElementById("bin" + playlistGoalArrayId);
    if (bin) {
      bin.classList.remove('dropped');
      bin.setAttribute('droppable', '');
    }
  };

  // Save the playlist to the API
  this.savePlaylist = function () {
    // Theoretically, this should work
    self.playlist.put({
      syncPlaylist: false
    }).then(function() {
      $location.path('/playlists/' + self.playlist.Id);
    });
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
