angular.module("app").controller('PlaylistCreateController', function ($scope, $location, AuthenticationService, TracksService, PlaylistService, $http) {
  $scope.title = "Add a Ride";
  $scope.goalid = 0; // The active goal playlist which tracks can be added to
  $scope.tracks = {};
  $scope.playing = false;

  // TODO: move the 0 into some kind of persistent state
  $http.get('/api/v1.0/rides/0').success(function (data) {
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

  // Add a track to a goal playlist
  $scope.addTrack = function(track) {
    // If there are already tracks don't add one
    var tracks = PlaylistService.getGoalPlaylist($scope.goalid);
    if (tracks.length > 0) { return; }

    PlaylistService.trackDropped($scope.goalid, track);

    // A track was "dropped"
    var bin = document.getElementById("bin" + $scope.goalid);
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
