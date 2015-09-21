angular.module("app.playlist", []).controller('PlaylistController', function ($location, AuthenticationService, TracksService, TracksFactory, PlaylistService, PlaylistFactory, $http) {
  var self = this;
  var playing = false; // If music is playing or not

  this.title = "Add a Ride";
  this.goals = PlaylistFactory.goals;
  this.name = PlaylistFactory.name;
  this.playlist = PlaylistFactory.playlist;
  this.tracks = TracksFactory.tracks;

  // TODO: move the 0 into some kind of persistent state
  $http.get('/api/v1.0/rides/0').success(function (data) {
    // Set the first goal as selected
    _.mapObject(data.goals, function (val, key) {
      if (key === '0') {
        val.show = true;
        PlaylistFactory.currentgoal = {id: val.id, bpm_low: val.bpm_low, bpm_high: val.bpm_high};
        return val;
      }
    });

    // TODO: I don't know how to set these in PlaylistFactory but have the data binding work i.e. value changes aren't showing on the view
    // This pattern of moving variables into a Factory and then binding them in a controller with this.variable = Factory.variable works
    // with playlist and tracks but not with goals, name and currentgoal. No idea why.
    // It's probably because I'm doing this within a $http callback so angular doesn't know about it?
    // Or maybe there's a $rootScope.$apply(); which has to run after this gets assigned? Damned if I know.
    self.goals = data.goals;
    self.name = data.name;

    // Set up a placeholder playlist structure
    PlaylistService.setupEmptyPlaylist(data.goals);
  });

  this.loadPlaylist = function () {
    // Load a saved playlist
    $http.get('/api/v1.0/playlists/0').success(function (data) {
      // Extract the track data
      data.goals.forEach(function (value) {
        PlaylistFactory.currentgoal.id = value.id;
        // TODO: this should be refactored so this entire $http function can be moved into the Playlist service
        self.addTrackSuccess(value.track);
        PlaylistService.addTrackToGoalPlaylist(value.id, value.track);
      });
    });
  };

  this.playTrack = function (trackid) {
    if (trackid === TracksFactory.playertrack[0]) {
      if (playing) {
        // Pause the currently playing track
        DZ.player.pause();
        DZ.player.pause();
        playing = false;
      }
      else {
        DZ.player.play();
        playing = true;
      }
    }
    else {
      // Play a different track
      TracksService.setPlayerTrack(trackid);
      DZ.player.playTracks([trackid]);
      DZ.player.play();
      playing = true;
    }
  };

  /**
   * The user has just clicked on a goal; potentially open/close it and make it active/inactive
   * @param goal
   */
  this.goalClicked = function (goal) {
    // User has clicked on an open, unselected goal, so don't collapse it
    if (goal.show) {

      // Collapse this open and selected goal
      if (PlaylistFactory.currentgoal.id === goal.id) {
        goal.show = !goal.show;
      }
    }
    else {
      goal.show = !goal.show;
    }
    PlaylistFactory.currentgoal.id = goal.id;
    PlaylistFactory.currentgoal.bpm_low = goal.bpm_low;
    PlaylistFactory.currentgoal.bpm_high = goal.bpm_high;
  };

  /**
   * Is this an active goal?
   * @param goal
   * @returns {boolean}
   */
  this.isGoalActive = function(goal) {
    if (goal.show === true && PlaylistFactory.currentgoal.id === goal.id) {
      return true;
    }
  };

  // Add a track to a goal self. If it passes our checks, call addTrackSuccess
  this.addTrack = function(track) {
    if (track.bpm < PlaylistFactory.currentgoal.bpm_low || track.bpm > PlaylistFactory.currentgoal.bpm_high) {
      // TODO: show some kind of helpful error message to the user
      return;
    }

    // If there are already tracks don't add one
    var tracks = PlaylistService.getGoalPlaylist(PlaylistFactory.currentgoal.id);
    if (tracks.length > 0) { return; }

    self.addTrackSuccess(track);
  };

  /**
   * A track has successfully been added, so do some DOM operations to show that
   * @param track
   */
  this.addTrackSuccess = function (track) {
    PlaylistService.trackDropped(PlaylistFactory.currentgoal.id, track);

    // A track was "dropped"
    console.log(PlaylistFactory.currentgoal.id);
    // TODO: take this out once we're loading actual playlists
    if (PlaylistFactory.currentgoal.id > 9) {return;}
    var bin = document.getElementById("bin" + PlaylistFactory.currentgoal.id);
    if (bin) {
      bin.classList.add('dropped');
      bin.removeAttribute('droppable');
    }

    var trackElement = document.getElementById("track" + track.id);
    if (trackElement) {
      trackElement.classList.add('ng-hide');
    }
  };

  // Remove a track from a goal playlist
  this.removeTrack = function(goalid, track) {
    PlaylistService.removeTrackFromGoalPlaylist(goalid, track);

    // The track isn't "dropped" any more
    var bin = document.getElementById("bin" + goalid);
    bin.classList.remove('dropped');
    bin.setAttribute('droppable', '');

    // Show the track in the track list
    var trackElement = document.getElementById("track" + track.id);
    trackElement.classList.remove('ng-hide');
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
