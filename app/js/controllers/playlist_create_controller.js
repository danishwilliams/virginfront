angular.module("app").controller('PlaylistCreateController', function($scope, $location, ApiService, AuthenticationService, $http) {
  $scope.title = "Add a Ride";

  $http.get('/api/v1.0/ride_types').success(function(data) {
    $scope.ride_types = data;
  });

  var onLogoutSuccess = function(response) {
    $location.path('/login');
  };

  $scope.logout = function() {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
