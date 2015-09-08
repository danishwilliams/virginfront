angular.module("app").controller('PlaylistCreateController', function ($scope, $location, ApiService, AuthenticationService, SongsService, PlaylistService, $http) {
  $scope.title = "Add a Ride";
  $scope.goalid = 0; // The active goal playlist which songs can be added to
  $scope.songs = {};

  // TODO: move the 0 into some kind of persistent state
  $http.get('/api/v1.0/rides/0').success(function (data) {
    $scope.goals = data.goals;
    $scope.name = data.name;

    // Set up a placeholder playlist structure
    PlaylistService.setupEmptyPlaylist(data.goals);

    $scope.playlist = PlaylistService.getPlaylist();
  });

  //$scope.songs = SongsService.getSongs();

  $scope.$on('playlistLoaded', function() {
    $scope.$apply(function() {
      $scope.songs = SongsService.getSongs();
    });
  });

  // Add a song to a goal playlist
  $scope.addSong = function(songid) {
    // If there are already songs don't add one
    var songs = PlaylistService.getGoalPlaylist($scope.goalid);
    if (songs.length > 0) { return; }

    PlaylistService.songDropped($scope.goalid, songid);

    // A song was "dropped"
    var bin = document.getElementById("bin" + $scope.goalid);
    bin.classList.add('dropped');
    bin.removeAttribute('droppable');

    var song = document.getElementById("song" + songid);
    song.classList.add('ng-hide');
  };

  // Remove a song from a goal playlist
  $scope.removeSong = function(goalid, songid) {
    PlaylistService.removeSongFromGoalPlaylist(goalid, songid);

    // The song isn't "dropped" any more
    var bin = document.getElementById("bin" + goalid);
    bin.classList.remove('dropped');
    bin.setAttribute('droppable', '');

    // Show the song in the song list
    var song = document.getElementById("song" + songid);
    song.classList.remove('ng-hide');
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  $scope.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
