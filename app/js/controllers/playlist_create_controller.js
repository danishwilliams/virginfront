angular.module("app").controller('PlaylistCreateController', function ($scope, $location, AuthenticationService, TracksService, PlaylistService, $http) {
  $scope.title = "Add a Ride";
  $scope.currentgoal = 0; // The currently selected goal which tracks can be added to

  // TODO: move the 0 into some kind of persistent state
  $http.get('/api/v1.0/rides/0').success(function (data) {
    $scope.goals = data.goals;
    $scope.name = data.name;

    // Set up a placeholder playlist structure
    PlaylistService.setupEmptyPlaylist(data.goals);

    $scope.playlist = PlaylistService.getPlaylist();
  });

  $scope.tracks = TracksService.getTracks();

  /**
   * The user has just clicked on a goal; potentially open/close it and make it active/inactive
   * @param goal
   */
  $scope.goalClicked = function(goal) {
    // User has clicked on an open, unselected goal, so don't collapse it
    if (this.goal.show) {

      // Collapse this open and selected goal
      if ($scope.currentgoal === this.goal.id) {
        this.goal.show = !this.goal.show;
      }
    }
    else {
      this.goal.show = !this.goal.show;
    }
    $scope.currentgoal = this.goal.id;
  };

  /**
   * Is this an active goal?
   * @param goal
   * @returns {boolean}
   */
  $scope.isGoalActive = function(goal) {
    if (this.goal.show === true && $scope.currentgoal === this.goal.id) {
      return true;
    }
  };

  // Add a track to a goal playlist
  $scope.addTrack = function(track) {
    // If there are already tracks don't add one
    var tracks = PlaylistService.getGoalPlaylist($scope.currentgoal);
    if (tracks.length > 0) { return; }

    PlaylistService.trackDropped($scope.currentgoal, track);

    // A track was "dropped"
    var bin = document.getElementById("bin" + $scope.currentgoal);
    bin.classList.add('dropped');
    bin.removeAttribute('droppable');

    var trackElement = document.getElementById("track" + track.id);
    trackElement.classList.add('ng-hide');
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
