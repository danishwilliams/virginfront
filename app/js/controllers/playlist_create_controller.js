angular.module("app").controller('PlaylistCreateController', function($scope, $location, ApiService, AuthenticationService, $http) {
  $scope.title = "Add a Ride";

  // TODO: move the 0 into some kind of persistent state
  $http.get('/api/v1.0/rides/0').success(function(data) {
    $scope.goals = data.goals;
  });

  var onLogoutSuccess = function(response) {
    $location.path('/login');
  };

  $scope.logout = function() {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
