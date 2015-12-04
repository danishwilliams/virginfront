angular
  .module("app")
  .directive("gymRides", gymRides);

function gymRides() {
  var directive = {
    templateUrl: 'gym_rides.directive.html',
    restrict: 'E',
    controller: gymRidesController,
    controllerAs: 'vm',
    scope: {
      gymid: '@',
      name: '@'
    },
    required: ['ngModel']
  };
  return directive;
}

gymRidesController.$inject = ['Playlists', '$scope'];

function gymRidesController(Playlists, $scope) {
  var self = this;
  // $scope.gymid;

  Playlists.loadPlaylists(5).then(function(data) {
    self.playlists = data;
    console.log(data);
  });
}
