angular.module("app").controller('PlaylistCreateController', function ($scope, $location, ApiService, AuthenticationService, SongsService, PlaylistService, $http) {
    $scope.title = "Add a Ride";

    // TODO: move the 0 into some kind of persistent state
    $http.get('/api/v1.0/rides/0').success(function (data) {
      $scope.goals = data.goals;
      $scope.name = data.name;

      // This sets up an empty goals structure
      PlaylistService.setupEmptyPlaylist(data.goals);

      // Add a few songs
      PlaylistService.addSongToGoalPlaylist(0, $scope.songs[0]);
      PlaylistService.addSongToGoalPlaylist(0, $scope.songs[1]);

      // Remove a song
      PlaylistService.removeSongFromGoalPlaylist(0, 100);

      PlaylistService.getPlaylist();
      $scope.playlist = PlaylistService.getPlaylist();
    });

    $scope.songs = SongsService.getSongs();

    var onLogoutSuccess = function (response) {
      $location.path('/login');
    };

    $scope.logout = function () {
      AuthenticationService.logout().success(onLogoutSuccess);
    };
  }
)
;
