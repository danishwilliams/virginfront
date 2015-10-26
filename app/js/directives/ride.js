angular
  .module("app")
  .directive("ride", RideDirective);

function RideDirective() {
  var directive = {
    link: link,
    templateUrl: 'ride.directive.html',
    restrict: 'EA',
    controller: rideController,
    controllerAs: 'ride'
  };
  return directive;

  function link(scope, element, attrs) {
  }
}

rideController.$inject = ['$scope'];

function rideController($scope) {
  //console.log($scope.playlist);
}
