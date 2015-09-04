angular.module("app").controller('PlaylistCreateController', function ($scope, $location, ApiService, AuthenticationService, $http) {
    $scope.title = "Add a Ride";

    // TODO: move the 0 into some kind of persistent state
    $http.get('/api/v1.0/rides/0').success(function (data) {
      $scope.goals = data.goals;
      $scope.name = data.name;
    });

    $scope.songs = [
      {
        name: 'Black Magic',
        artist: 'Little Mix',
        genre: 'Pop',
        bpm: '80',
        time: '03:31'
      },
      {
        name: 'How deep is your love',
        artist: 'Calvin Harris',
        genre: 'Alternative',
        bpm: '80',
        time: '03:32'
      },
      {
        name: 'Too bad, so sad',
        artist: 'Matric',
        genre: 'R&B/Soul',
        bpm: '80',
        time: '03:24'
      }
    ];

    var onLogoutSuccess = function (response) {
      $location.path('/login');
    };

    $scope.logout = function () {
      AuthenticationService.logout().success(onLogoutSuccess);
    };
  }
)
;
