angular.module("app").controller('PlaylistCreateController', function ($scope, $location, AuthenticationService, TracksService, PlaylistService, $http) {
  $scope.title = "Add a Ride";
  $scope.goalid = 0; // The active goal playlist which tracks can be added to
  $scope.tracks = {};
  $scope.playing = false;
  $scope.currentgoal = {id: 0, bpm_low: 0, bpm_high: 0}; // The currently selected goal which tracks can be added to
  $scope.playlist = [];

  // TODO: move the 0 into some kind of persistent state
  $http.get('/api/v1.0/rides/0').success(function (data) {
    // Set the first goal as selected
    _.mapObject(data.goals, function(val, key) {
      if (key === '0') {
        val.show = true;
        $scope.currentgoal = {id: val.id, bpm_low: val.bpm_low, bpm_high: val.bpm_high};
        return val;
      }
    });

    $scope.goals = data.goals;
    $scope.name = data.name;

    // Set up a placeholder playlist structure
    PlaylistService.setupEmptyPlaylist(data.goals);

    $scope.playlist = PlaylistService.getPlaylist();
  });

  //$scope.tracks = TracksService.getTracks();

  $scope.$on('tracksLoaded', function () {
    $scope.$apply(function () {
      $scope.tracks = TracksService.getTracks();
    });
  });

  $scope.playTrack = function (trackid) {
    var playerTrack = TracksService.getPlayerTrack();
    if (trackid === playerTrack[0]) {
      if ($scope.playing) {
        // Pause the currently playing track
        DZ.player.pause();
        DZ.player.pause();
        $scope.playing = false;
      }
      else {
        DZ.player.play();
        $scope.playing = true;
      }
    }
    else {
      // Play a different track
      TracksService.setPlayerTrack(trackid);
      DZ.player.playTracks([trackid]);
      DZ.player.play();
      $scope.playing = true;
    }
  };

  /*
  // Load a playlist
  $http.get('/api/v1.0/playlists/0').success(function (data) {
    // Extract the track data
    data.goals.forEach(function(value) {
      $scope.currentgoal.id = value.id;
      $scope.addTrackSuccess(value.track);
      PlaylistService.addTrackToGoalPlaylist(value.id, value.track);
    });
    $scope.playlist = PlaylistService.getPlaylist();
  });
  */

  /**
   * The user has just clicked on a goal; potentially open/close it and make it active/inactive
   * @param goal
   */
  $scope.goalClicked = function(goal) {
    // User has clicked on an open, unselected goal, so don't collapse it
    if (this.goal.show) {

      // Collapse this open and selected goal
      if ($scope.currentgoal.id === this.goal.id) {
        this.goal.show = !this.goal.show;
      }
    }
    else {
      this.goal.show = !this.goal.show;
    }
    $scope.currentgoal.id = this.goal.id;
    $scope.currentgoal.bpm_low = this.goal.bpm_low;
    $scope.currentgoal.bpm_high = this.goal.bpm_high;
  };

  /**
   * Is this an active goal?
   * @param goal
   * @returns {boolean}
   */
  $scope.isGoalActive = function(goal) {
    if (this.goal.show === true && $scope.currentgoal.id === this.goal.id) {
      return true;
    }
  };

  // Add a track to a goal playlist. If it passes our checks, call addTrackSuccess
  $scope.addTrack = function(track) {
    if (track.bpm < $scope.currentgoal.bpm_low || track.bpm > $scope.currentgoal.bpm_high) {
      // TODO: show some kind of helpful error message to the user
      return;
    }

    // If there are already tracks don't add one
    var tracks = PlaylistService.getGoalPlaylist($scope.currentgoal.id);
    if (tracks.length > 0) { return; }

    $scope.addTrackSuccess(track);
  };

  /**
   * A track has successfully been added, so do some DOM operations to show that
   * @param track
   */
  $scope.addTrackSuccess = function(track) {
    PlaylistService.trackDropped($scope.currentgoal.id, track);

    // A track was "dropped"
    var bin = document.getElementById("bin" + $scope.currentgoal.id);
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
  $scope.removeTrack = function(goalid, track) {
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

  $scope.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
