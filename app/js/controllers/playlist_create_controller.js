angular.module("app").controller('PlaylistCreateController', function($scope, $location, AuthenticationService) {
  $scope.title = "Add a Ride";

  var onLogoutSuccess = function(response) {
    $location.path('/login');
  };

  $scope.logout = function() {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
