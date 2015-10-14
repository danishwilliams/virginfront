angular.module("app.playlist_edit", []).controller('Playlist_editController', function ($routeParams, $location, AuthenticationService, Tracks, PlaylistEdit, Templates) {
  var self = this;
  var playing = false; // If music is playing or not

  // TODO: do we want to sanitize this?
  this.id = $routeParams.id;

  this.title = "Add a Ride";
  this.playlist = PlaylistEdit.getPlaylist();
  this.tracks = Tracks.getTracks();
  this.currentgoal = PlaylistEdit.getCurrentGoal();

  PlaylistEdit.setStep(2);

  // Load tracks from the user's default genre selection
  Tracks.loadUserGenresTracks().then(function(data) {
    self.tracks = data;
  });

  // Create new playlist
  if ($location.path().substring(0, 15) === '/playlists/new/') {
    // TODO: refactor this once NgNewRouter allows for multiple ways to call a component with ng-link
    if ($location.path().substring(15, 23) === 'playlist') {
      self.id = $location.path().substring(24);
    }
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
  } else {
    // We should never land here
    console.log('[Warning] What are you doing here?! You should be adding or editing a playlist');
    // TODO: legacy code. Remove once playlist creation is working
    /*
    PlaylistEdit.loadGoals().then(function (data) {
      console.log(data);
      self.playlistGoals = data.Goals;
      self.name = data.Name;
      self.playlist = data;
      // TODO: this shouldn't be necessary: the data binding should recognise the change
      self.currentgoal = PlaylistEdit.getCurrentGoal();
    });
    */
  }

  this.playTrack = function (trackid) {
    var playertrack = Tracks.getPlayerTrack();
    if (trackid === playertrack[0]) {
      if (playing) {
        // Pause the currently playing track
        DZ.player.pause();
        DZ.player.pause();
        playing = false;
      } else {
        DZ.player.play();
        playing = true;
      }
    } else {
      // Play a different track
      Tracks.setPlayerTrack(trackid);
      DZ.player.playTracks([trackid]);
      DZ.player.play();
      playing = true;
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
    });
    /*
    // Format the playlist object properly before the PUT
    var newPlaylist = {};
    var playlistGoals = [];
    var i = 0;
    self.playlistGoals.forEach(function (goal) {
      if (i > 0) {
        return;
      }

      delete goal.GoalOptions;

      playlistGoals[i] = {
        SortOrder: goal.SortOrder,
        PlaylistId: self.playlist.Id,
        GoalId: goal.Id,
        Goal: goal
      };
      i++;
    });
    console.log(self.playlist);
    newPlaylist = Restangular.one('playlists', "21df6644-5180-4258-b790-1017de0d0eb4");
    newPlaylist.Id = self.playlist.Id;
    newPlaylist.Name = "A very dark place";
    newPlaylist.TemplateName = self.playlist.Name;
    newPlaylist.Shared = false;
    newPlaylist.UserId = "0b51cf07-44df-46e4-a1a3-6a7c018e04b3";
    newPlaylist.PlaylistGoals = playlistGoals;
    newPlaylist.Name = "Working playlist?";
    newPlaylist.ClassLengthMinutes = self.playlist.ClassLengthMinutes;
    console.log(newPlaylist);
    //self.playlist.put();

    // Overwrite an existing playlist
    newPlaylist.put();
    */
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
