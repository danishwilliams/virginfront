angular.module("app.default_goals", []).controller('DefaultGoalsController', function (Users, Goals, Beats, spinnerService) {
  var self = this;
  self.posInts = /^[1-9][0-9]*$/; // Regex for positive integers. Used for form validation

  self.isCustomRpm = Users.getCurrentUser().Location.Country.CustomRpm;

  Goals.loadFreestyleGoals().then(function (data) {
    spinnerService.hide('freestyleAdminGoals');
    self.goals = data;
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

  /**
   * Manually passing in "valid" here (the validity of the form containing the goal) because there's an angular bug wherein
   * if <form> isn't used (and I'm using two nested ng-form's) then the value of form.$submitted is always wrong. Solution:
   * manually handle the form submission logic by moving it onto the goal object.
   */
  self.update = function(goal, valid) {
    goal.submitted = true;
    if (!valid) {
      return;
    }
    goal.saving = true;
    goal.put().then(function() {
      goal.saving = false;
      goal.saved = true;
    });
  };
});
