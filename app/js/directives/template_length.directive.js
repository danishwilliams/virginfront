angular.module('app').directive('templateLength', template);

function template() {
  var directive = {
    link: link,
    restrict: 'E',
    templateUrl: 'template_length.directive.html',
    controller: TemplateController,
    controllerAs: 'vm',
    scope: {
      id: '@',
      createnew: '@',
      mins: '@'
    }
  };
  return directive;

  function link(scope, element, attrs) {
    scope.vm.id = scope.id;
  }
}

TemplateController.$inject = ['$scope', '$state', '$stateParams', 'Templates', 'Beats', 'spinnerService', 'uuid2', 'Goals'];

function TemplateController($scope, $state, $stateParams, Templates, Beats, spinnerService, uuid2, Goals) {
  var self = this;
  self.id = $scope.id;
  self.template = {};

  if ($scope.createnew) {
    // New template
    self.newTemplate = true;
    Templates.createBlankTemplate(self.id, $scope.mins).then(function (data) {
      self.template = data;
      self.initFreestyleGoals();
    });
  }

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

  if (!self.newTemplate) {
    // Editing a template
    Templates.loadTemplate(self.id, self.mins).then(function (data) {
      self.template = data;
    });
  }

  Beats.loadBeats().then(function (data) {
    self.beats = data;
  });

  // This is a Freestyle playlist, so create a list of freestyle goals which can then be added
  self.initFreestyleGoals = function () {
    self.freestyleGoals = [];
    for (var i = 0; i < self.template.MaxFreestyleGoals - 1; i++) {
      self.freestyleGoals[i] = {
        show: true
      };
    }
  };

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
    goal.GoalOptions.push({});
    goal.Interval = true;
  };

  self.removeIntervalGoal = function (goal) {
    goal.GoalOptions.splice(1, 1);
    goal.Interval = false;
  };

  this.addFreestyleGoal = function (goal) {
    goal.show = false;
    var freestyleGoal = angular.copy(self.freestyleGoal.Goal);
    var i = self.template.Goals.length;
    // Remove a goal from freestyle goals, so that we can tell the <freestyle-goals> directive
    self.freestyleGoals.splice(0, 1);
    freestyleGoal.ArrayId = i;
    freestyleGoal.SortOrder = i + 1;
    self.template.Goals.push(freestyleGoal);
    self.goalClicked(freestyleGoal);
  };

  this.changeFreestyleGoal = function (goal) {
    // Without explicitly defining each variable, angular doesn't trigger a $digest. Urgh.
    goal.Id = self.freestyleGoal.Goal.Id;
    goal.ArrayId = self.freestyleGoal.ArrayId;
    goal.GoalId = goal.Id;
    goal.Name = self.freestyleGoal.Goal.Name;
    goal.BpmLow = self.freestyleGoal.Goal.BpmLow;
    goal.BpmHigh =  self.freestyleGoal.Goal.BpmHigh;
    goal.GoalChallenge = self.freestyleGoal.Goal.GoalChallenge;
    goal.GoalChallengeId = self.freestyleGoal.Goal.GoalChallengeId;
    goal.GoalOptions = self.freestyleGoal.Goal.GoalOptions;
    goal.Name = self.freestyleGoal.Goal.Name;
    goal.show = true;
    goal.edit = false;
  };

  /**
   * Validates the template
   */
  function validateTemplate() {
    var result = Templates.isValidTemplate(self.template);
    if (!result.valid) {
      self.template = result.template;
    }
    return result.valid;
  }

  self.saveTemplate = function () {
    if (!validateTemplate()) {
      return;
    }

    spinnerService.show('saveTemplate' + self.template.Id + 'TimeSpinner');

    // See if there are any new default goals which must be added
    if ($scope.createnew) {
      self.template.Goals.forEach(function (goal) {
        if (goal.NewGoal) {
          Goals.saveNewDefaultGoal(goal).then(function (data) {});
        }
      });
    }

    // Save the template
    self.template.put().then(function () {
      spinnerService.hide('saveTemplate' + self.template.Id + 'TimeSpinner');

      var message = self.newTemplate ? 'TEMPLATE_ADDED' : 'TEMPLATE_EDITED';
      Templates.setMessage('success', message);
      $state.go('templategroup', {
        id: self.template.TemplateGroup.Id
      }, {
        reload: true
      });
    });
  };
}
