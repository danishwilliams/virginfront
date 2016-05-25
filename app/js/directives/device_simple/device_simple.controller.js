angular
  .module("app")
  .directive("deviceSimple", deviceSimple);

function deviceSimple() {
  var directive = {
    templateUrl: '../js/directives/device_simple/device_simple.html',
    restrict: 'E'
  };
  return directive;
}