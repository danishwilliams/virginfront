angular
  .module("app")
  .directive("reporting", reporting);

function reporting() {
  var directive = {
    templateUrl: '../js/directives/reporting/reporting.directive.html',
    restrict: 'E',
    controller: reportingController,
    controllerAs: 'vm'
  };
  return directive;
}

reportingController.$inject = [];

function reportingController() {
}
