angular
  .module("app")
  .directive("device", device);

function device() {
  var directive = {
    templateUrl: '../js/directives/device/device.html',
    restrict: 'E'
  };
  return directive;
}