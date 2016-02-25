angular.module("app.default_goals", []).controller('DefaultGoalsController', function (Goals, Beats, spinnerService) {
  var self = this;

  Goals.loadFreestyleGoals().then(function (data) {
    spinnerService.hide('freestyleAdminGoals');
    self.goals = data;
  });

  self.effortOptions = [40];
  for (i = 45; i <= 100; i = i + 5) {
    self.effortOptions.push(i);
  }
  // TODO: don't show 0
  self.bpmOptions = [0];
  for (i = 60; i <= 180; i = i + 10) {
    self.bpmOptions.push(i);
  }
  self.rpmOptions = [0];
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


  self.update = function(goal) {
    goal.put();
  };
});
