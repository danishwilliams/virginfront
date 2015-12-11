angular
  .module("app")
  .directive("ride", RideDirective);

function RideDirective() {
  var directive = {
    templateUrl: 'ride.directive.html',
    restrict: 'EA'
  };
  return directive;
}
