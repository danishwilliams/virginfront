angular
  .module("app")
  .directive("gymRides", gymRides);

function gymRides() {
  var directive = {
    templateUrl: 'gym_rides.directive.html',
    restrict: 'E',
    controller: gymRidesController,
    controllerAs: 'vm'
  };
  return directive;
}

gymRidesController.$inject = [];

function gymRidesController() {
  var self = this;

  self.remove = function(playlist) {
    playlist.removed = true;
    console.log(playlist);
  };

  self.undoRemove = function (playlist) {
    playlist.removed = false;
  };
}
