angular
  .module("app")
  .directive("freestyleGoals", freestyleGoals);

freestyleGoals.$inject = ['Goals', 'spinnerService'];

function freestyleGoals(Goals, spinnerService) {
  var directive = {
    templateUrl: '../js/directives/freestyle_goals/freestyle_goals.directive.html',
    restrict: 'E',
    controller: freestyleGoalsController,
    controllerAs: 'vm',
    scope: {
      ngModel: '=',
      disabled: '@', // if this dropdown should be disabled
      totalGoals: '@', // total goals in the list. @see index
      index: '@', // the current goal number in the list, so that we know when we're rendering the last dropdown (for 'Cool Down')
      allowCreateNewGoal: '@', // allows for the creation of a new default freestyle goal i.e. in template creation
      allowEditingGoal: '@', // Shows 'Select a different' as default
      changingGoal: '@' // When editing a playlist, we want the select options to now show anything about creating a new goal
    },
    require: '?ngModel',
    link: link
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    scope.vm.disabled = scope.disabled;
    scope.vm.index = scope.index;
    scope.vm.totalGoals = scope.totalGoals;
    scope.vm.allowCreateNewGoal = scope.allowCreateNewGoal;
    scope.vm.allowEditingGoal = scope.allowEditingGoal;
    scope.vm.changingGoal = scope.changingGoal;
    scope.vm.addAGoal = true;
    scope.random = Math.floor(Math.random() * 10000);
    if (scope.vm.allowEditingGoal || scope.vm.changingGoal) {
      scope.vm.addAGoal = false;
    }

    scope.vm.coolDown = false;

    if (scope.vm.index === '0') {
      loadFreestyleGoals();
    }
    else {
      scope.vm.goals = Goals.getFreestyleGoals();
      if (_.isEmpty(scope.vm.goals)) {
        // Basically, we're calling this directive from a freestyle playlist where $index is never 0 (because the
        // first goal is always Warm Up) and therefore the Freestyle Goals are never loaded.
        scope.vm.manualLoading = true;
        loadFreestyleGoals();
      }
      else {
        areThereChallengeGoals(scope.vm.goals);
      }
    }

    function loadFreestyleGoals() {
      Goals.loadFreestyleGoals().then(function (data) {
        if (scope.vm.index) {
          spinnerService.hide('freestyleSpinner' + scope.random);
        }
        scope.vm.goals = data;

        areThereChallengeGoals(scope.vm.goals);

        // Creating a new goal i.e. in template creation
        if (scope.vm.allowCreateNewGoal || scope.vm.allowEditingGoal) {
          scope.vm.newGoal = Goals.createBlankDefaultGoal();
        }

        // This is a Cool Down goal!
        /*
        // 2016.03.03 Removed the requirement that the last goal must be a Cool Down goal, but keeping
        // this logic here in case we want to re-enable in future
        if (parseInt(scope.vm.index) + 1 === parseInt(scope.vm.totalGoals)) {
          scope.vm.coolDown = true;
        }
        */
      });
    }

    function areThereChallengeGoals(goals) {
      // Are there any challenge goals?
      goals.forEach(function(goal) {
        if (goal.Goal.GoalChallengeId) {
          scope.vm.hasChallengeGoals = true;
        }
        else {
          scope.vm.hasGoals = true;
        }
      });
    }

    // Had to move the logic for ng-disabled here because stupid IE doesn't like the exact same logic in ng-disabled
    scope.isDisabled = function() {
      if (scope.disabled === 'true' || !scope.vm.goals) {
        return true;
      }
      scope.vm.goals = Goals.getFreestyleGoals();
      return false;
    };

    scope.selected = function (id) {
      // This triggers the ng-change on the directive so the parent controller can get the value
      // We're passing an entire goal object back to the parent
      if (id === 'newGoal') {
        if (scope.allowCreateNewGoal || scope.allowEditingGoal) {
          // Pass a blank goal to the parent
          scope.vm.newGoal = Goals.createBlankDefaultGoal();
          ngModel.$setViewValue(scope.vm.newGoal);
        }
      }
      else {
        // Pass the chosen goal to the parent
        ngModel.$setViewValue(scope.vm.goals[id]);
      }
    };
  }
}

function freestyleGoalsController() {
}
