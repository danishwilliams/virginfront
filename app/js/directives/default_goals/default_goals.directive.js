angular
  .module("app")
  .directive("defaultGoals", defaultGoals);

function defaultGoals(Goals, spinnerService) {
  var directive = {
    templateUrl: '../js/directives/default_goals/default_goals.directive.html',
    restrict: 'E',
    controller: defaultGoalsController,
    controllerAs: 'vm',
    scope: {
      challengeGoals: '@', // Boolean: if we're loading up challenge goals or default goals (which is the, uh, default)
    },
    link: link
  };
  return directive;

  function link(scope, element, attrs) {
    scope.vm.challengeGoals = scope.challengeGoals;
    scope.vm.random = Math.floor(Math.random() * 10000);
  }
}

defaultGoalsController.$inject = ['Users', 'Goals', 'Beats', 'spinnerService'];

function defaultGoalsController(Users, Goals, Beats, spinnerService) {
  var self = this;
  self.goals = [];
  self.posInts = /^[1-9][0-9]*$/; // Regex for positive integers. Used for form validation

  self.isCustomRpm = Users.getCurrentUser().Location.Country.CustomRpm;

  Goals.loadFreestyleGoals().then(function (data) {
    self.loaded = true;
    spinnerService.hide('freestyleAdminGoals' + self.random);
    data.forEach(function (goal) {
      if (self.challengeGoals) {
        if (goal.Goal.GoalChallengeId) {
          self.goals.push(goal);
        }
      } else {
        if (!goal.Goal.GoalChallengeId) {
          self.goals.push(goal);
        }
      }
    });
    // If we sort inside the ng-repeat, then when the goal name is editing the goal will start jumping all over the
    // sorted list...which makes it really hard to follow. But if we presort the list, then it's easy.
    self.goals = _.sortBy(self.goals, function (goal) {
      return goal.Goal.Name;
    });
  });

  self.effortOptions = [40];
  for (i = 45; i <= 100; i = i + 5) {
    self.effortOptions.push(i);
  }
  self.bpmOptions = [];
  for (i = 60; i <= 180; i = i + 10) {
    self.bpmOptions.push(i);
  }
  self.rpmOptions = [];
  for (i = 60; i <= 180; i = i + 5) {
    self.rpmOptions.push(i);
  }

  Beats.loadBeats().then(function (data) {
    self.beats = data;
  });

  /**
   * The user has just clicked on a goal; open/close it. Need this function so we can click on the input box
   * inside of the goal (which itself has an ng-click on it).
   * @param goal
   */
  self.goalClicked = function (goal) {
    if (goal.edit) {
      // We're currently selecting a different freestyle goal, so don't do anything else
      return;
    }
    if (goal.editGoalName) {
      // We're currently selecting a different freestyle goal, so don't do anything else
      return;
    }
    goal.show = !goal.show;
  };

  self.addIntervalGoal = function (goal) {
    goal.Goal.GoalOptions.push({});
    goal.Interval = true;
  };

  self.removeIntervalGoal = function (goal, goalForm) {
    goalForm.$setDirty();
    goal.Goal.GoalOptions.splice(1, 1);
    goal.Interval = false;
  };

  /**
   * Manually passing in "valid" here (the validity of the form containing the goal) because there's an angular bug wherein
   * if <form> isn't used (and I'm using two nested ng-form's) then the value of form.$submitted is always wrong. Solution:
   * manually handle the form submission logic by moving it onto the goal object.
   */
  self.update = function (goal, valid, goalForm) {
    goal.submitted = true;
    if (!valid) {
      return;
    }
    goal.saving = true;
    goal.put().then(function () {
      goal.saving = false;
      goal.saved = true;
      goalForm.$setPristine();
    });
  };
}
