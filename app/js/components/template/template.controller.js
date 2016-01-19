angular.module("app.template", []).controller('TemplateController', function ($stateParams, Templates, Beats, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  this.template = {};

  self.effortOptions = [40, 50, 60, 70, 80, 90, 100];
  self.bpmOptions = [60, 70, 80, 90, 100, 110, 120, 130, 140];

  Templates.loadTemplate(this.id).then(function (data) {
    self.template = data;
  });

  Beats.loadBeats().then(function(data) {
    self.beats = data;
  });

  /**
   * The user has just clicked on a goal; open/close it. Need this function so we can click on the input box
   * inside of the goal (which itself has an ng-click on it).
   * @param goal
   */
  self.goalClicked = function (goal) {
    if (goal.editGoalName) {
      // We're currently selecting a different freestyle goal, so don't do anything else
      return;
    }
    goal.show = !goal.show;
  };


  self.saveTemplate = function() {
    spinnerService.show('saveTemplateTimeSpinner');
    self.template.put().then(function() {
      spinnerService.hide('saveTemplateTimeSpinner');
    });
  };
});
