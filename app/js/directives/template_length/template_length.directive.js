angular.module('app').directive('templateLength', template);

function template() {
  var directive = {
    link: link,
    restrict: 'E',
    templateUrl: '../js/directives/template_length/template_length.directive.html',
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

TemplateController.$inject = ['$scope', '$state', '$stateParams', 'Templates', 'Beats', 'spinnerService', 'uuid2', 'Goals', '$q'];

function TemplateController($scope, $state, $stateParams, Templates, Beats, spinnerService, uuid2, Goals, $q) {
  var self = this;
  self.id = $scope.id;
  self.template = {};
  self.posInts = /^[1-9][0-9]*$/; // Regex for positive integers. Used for form validation

  if ($scope.createnew) {
    // New template
    self.newTemplate = true;
    Templates.createBlankTemplate(self.id, $scope.mins).then(function (data) {
      self.template = data;
      spinnerService.hide('templateSpinner' + self.id);
      self.initFreestyleGoals();
    });
  }

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

  if (!self.newTemplate) {
    // Editing a template
    Templates.loadTemplate(self.id, self.mins).then(function (data) {
      self.template = data;
      spinnerService.hide('templateSpinner' + self.template.Id);
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
    self.freestyleGoal = undefined; // So that the model we're watching on the freestyle-goals directive triggers an ng-change next time
  };

  this.changeFreestyleGoal = function (goal) {
    // Without explicitly defining each variable, angular doesn't trigger a $digest. Urgh.
    goal.Id = self.freestyleGoal.Goal.Id;
    goal.Aim = self.freestyleGoal.Goal.Aim;
    goal.ArrayId = self.freestyleGoal.ArrayId;
    goal.GoalId = goal.Id;
    if (self.freestyleGoal.Goal.NewGoal) {
      goal.NewGoal = self.freestyleGoal.Goal.NewGoal;
    }
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
   * Validates the template (unused because of switching to form.$valid)
   */
  /*
  function validateTemplate() {
    var result = Templates.isValidTemplate(self.template);
    if (!result.valid) {
      self.template = result.template;
    }
    return result.valid;
  }
  */

  self.saveTemplate = function () {
    spinnerService.show('saveTemplate' + self.template.Id + 'TimeSpinner');
    saveNewDefaultGoalsThenSaveTemplate();
  };

  // Using promises so that new default goal saving is synchronous, to handle the case where
  // multiple of the same default goal are entered at once
  function saveNewDefaultGoalsThenSaveTemplate() {
    var defer = $q.defer();
    var promises = [];

    // Remove any duplicate goals, so we don't accidentally try to save multiple goals at once
    var goalsUnique = _.uniq(self.template.Goals, function (item, key, Name) {
      return item.Name;
    });

    // See if there are any new default goals which must be added
    goalsUnique.forEach(function (goal) {
      if (goal.NewGoal) {
        promises.push(Goals.saveNewDefaultGoal(goal));
      }
    });

    $q.all(promises).then(function () {
      saveTheTemplate();
    }, function(err) {
      // Yes, there was an error, but save the template anyway
      console.log("Couldn't save a new default goal", err);
      saveTheTemplate();
    });

    return defer.promise;
  }

  function saveTheTemplate() {
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
  }

}