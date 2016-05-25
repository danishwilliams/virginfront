angular
  .module("app")
  .directive("ride", RideDirective);

function RideDirective() {
  var directive = {
    templateUrl: '../js/directives/ride/ride.directive.html',
    restrict: 'EA'
  };
  return directive;
}
