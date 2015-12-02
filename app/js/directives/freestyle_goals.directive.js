angular
  .module("app")
  .directive("freestyleGoals", freestyleGoals);

function freestyleGoals() {
  var directive = {
    templateUrl: 'freestyle_goals.directive.html',
    restrict: 'E',
    controller: freestyleGoalsController,
    controllerAs: 'vm',
    scope: {
      ngModel: '='
    },
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {
      // This triggers the ng-change on the directive so the parent controller can get the value
      scope.selected = function (id) {
        ngModel.$setViewValue(scope.vm.goals[id]);
        // reset select list to not select anything
        scope.vm.goalArrayId = undefined;
      };
    }
  };
  return directive;
}

freestyleGoalsController.$inject = ['$scope', 'Goals', 'spinnerService'];

function freestyleGoalsController($scope, Goals, spinnerService) {
  var self = this;
  spinnerService.show('playlistFreestyleSpinner');
  Goals.loadFreestyleGoals().then(function (data) {
    self.goals = data;
    spinnerService.hide('playlistFreestyleSpinner');
  });
}
