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

  self.effortOptions = [40, 50, 60, 70, 80, 90, 100];
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
    // Setting Id allows the API to save a new playlist goal
    freestyleGoal.Id = uuid2.newuuid().toString();
    freestyleGoal.ArrayId = i;
    freestyleGoal.SortOrder = i + 1;
    self.template.Goals.push(freestyleGoal);
    self.goalClicked(freestyleGoal);
  };

  self.saveTemplate = function () {
    spinnerService.show('saveTemplate' + self.template.Id + 'TimeSpinner');

    // See if there are any new default goals which must be added
    if ($scope.createnew) {
      self.template.Goals.forEach(function (goal) {
        if (goal.NewGoal) {
          //Goals.saveDefaultGoal(goal);
        }
      });
    }

    // Save the template
    self.template.put().then(function () {
      spinnerService.hide('saveTemplate' + self.template.Id + 'TimeSpinner');
      var action = self.newTemplate ? 'saved' : 'edited';
      $state.go('templategroup', {
        id: self.template.TemplateGroup.Id,
        action: action
      }, {
        reload: true
      });
    });
  };
}
