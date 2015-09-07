angular.module("app").controller('PlaylistCreateController', function ($scope, $location, ApiService, AuthenticationService, SongsService, PlaylistService, $http) {
  $scope.title = "Add a Ride";

  // TODO: move the 0 into some kind of persistent state
  $http.get('/api/v1.0/rides/0').success(function (data) {
    $scope.goals = data.goals;
    $scope.name = data.name;

    // Set up a placeholder playlist structure
    PlaylistService.setupEmptyPlaylist(data.goals);

    $scope.playlist = PlaylistService.getPlaylist();
  });

  $scope.songs = SongsService.getSongs();

  // Remove a song from a goal
  $scope.removeSong = function(goalid, songid) {
    PlaylistService.removeSongFromGoalPlaylist(goalid, songid);
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  $scope.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
