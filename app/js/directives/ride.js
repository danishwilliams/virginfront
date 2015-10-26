angular
  .module("app")
  .directive("ride", RideDirective);

function RideDirective() {
  var directive = {
    link: link,
    templateUrl: 'ride.html',
    restrict: 'EA',
    controller: rideController,
    controllerAs: 'vm'
  };
  return directive;

  function link(scope, element, attrs) {

  }
}

rideController.$inject = [];

function rideController() {
  var self = this;
  console.log(self.ride);
}
