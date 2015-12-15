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
      ngModel: '=',
      selectedGoalId: '@'
    },
    require: '?ngModel',
    link: link
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    scope.vm.selectedGoalId = scope.selectedGoalId;
    scope.selected = function (id) {
      // This triggers the ng-change on the directive so the parent controller can get the value
      ngModel.$setViewValue(scope.vm.goals[id]);
      // reset select list to not select anything
      scope.vm.goalArrayId = undefined;
    };
  }
}

freestyleGoalsController.$inject = ['Goals', 'spinnerService'];

function freestyleGoalsController(Goals, spinnerService) {
  var self = this;
  self.addAGoal = true;
  spinnerService.show('playlistFreestyleSpinner');

  Goals.loadFreestyleGoals().then(function (data) {
    self.goals = data;
    if (self.selectedGoalId) {
      self.addAGoal = false; // We're editing a goal
      // Auto-select the current goal
      _.mapObject(self.goals, function (val, key) {
        if (key >= 0) {
          if (val.GoalId === self.selectedGoalId) {
            self.goalArrayId = val.ArrayId;
          }
        }
      });
    }
    spinnerService.hide('playlistFreestyleSpinner');
  });
}
