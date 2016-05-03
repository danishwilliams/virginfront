angular
  .module("app")
  .directive("userSimple", userSimple);

function userSimple() {
  var directive = {
    templateUrl: '../js/directives/user_simple/user_simple.directive.html',
    restrict: 'E'
  };
  return directive;
}