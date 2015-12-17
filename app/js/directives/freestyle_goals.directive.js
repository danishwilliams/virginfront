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
      selectedGoalId: '@',
      ngDisabled: '@',
      totalGoals: '@',
      index: '@'
    },
    require: '?ngModel',
    link: link
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    scope.vm.selectedGoalId = scope.selectedGoalId;
    scope.vm.disabled = scope.ngDisabled;
    scope.vm.index = scope.index;
    scope.vm.totalGoals = scope.totalGoals;
    scope.selected = function (id) {
      // This triggers the ng-change on the directive so the parent controller can get the value
      ngModel.$setViewValue(scope.vm.goals[id]);
    };
  }
}

freestyleGoalsController.$inject = ['Goals', 'spinnerService'];

function freestyleGoalsController(Goals, spinnerService) {
  var self = this;
  self.coolDown = false;
  self.addAGoal = true;
  spinnerService.show('playlistFreestyleSpinner');

  Goals.loadFreestyleGoals().then(function (data) {
    self.goals = data;

    // This is a Cool Down goal!
    if (parseInt(self.index) + 1 === parseInt(self.totalGoals)) {
      self.coolDown = true;
    }

    // Set the selected goal
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
