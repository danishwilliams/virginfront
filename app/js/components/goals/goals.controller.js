/*
angular.module("app.goals", []).controller('GoalsController', function (Goals, Restangular, uuid2, spinnerService) {
  var self = this;
  this.goals = [];
  this.newGoal = {};

  Goals.loadGoals().then(function (goals) {
    spinnerService.hide('goalsSpinner');
    self.goals = goals;
  });

  this.update = function (goal) {
    console.log('put running!');
    spinnerService.show('goalsSpinner');

    goal.put().then(function() {
      spinnerService.hide('goalsSpinner');
    }, function(response) {
      console.log("Error with status code", response.status);
      spinnerService.hide('goalsSpinner');
    });
  };

  this.delete = function (goal) {
    spinnerService.show('goalsSpinner');
    Restangular.one("goals", goal.Id).remove().then(function () {
      // Updating the list and removing the goal after the response is OK.
      var index = self.goals.indexOf(goal);
      if (index > -1) {
        self.goals.splice(index, 1);
      }
      spinnerService.hide('goalsSpinner');
    });
  };

  this.create = function (goal) {
    if (!goal.Name || !goal.CountryId || !goal.BpmLow || !goal.BpmHigh) {
      console.log("Missing attributes on the goal");
      return;
    }
    Restangular.one("goals", goal.Id).customPUT(goal).then(function () {
      // TODO: figure out how to move the above into the Goals factory
      console.log('Goal successfully saved');
      self.goals.push(goal);
      self.createBlankGoal();
    });
  };

  this.createBlankGoal = function () {
    self.newGoal = {
      Name: "",
      Id: uuid2.newuuid().toString(),
      BpmLow: "",
      BpmHigh: "",
      Aim: ""
    };
  };

  // TODO: refactor this module to use the Module Revealer pattern, so this code can come before the function
  self.createBlankGoal();
});

<h1>Goals</h1>

<spinner class="spinner" name="goalsSpinner" show="true"></spinner>

<table>
  <thead>
    <tr>
      <td>Goal Name</td>
      <td>BPM Low</td>
      <td>BPM High</td>
      <td>Aim</td>
      <td>Country Id</td>
      <td>Id</td>
      <td>Delete</td>
    </tr>
  </thead>
  <tbody>
    <tr ng-repeat="goal in goals.goals">
      <td contentEditable ng-change="goals.update(goal)" ng-model-options="{updateOn : 'change blur'}" ng-model="goal.Name"></td>
      <td contentEditable ng-change="goals.update(goal)" ng-model-options="{updateOn : 'change blur'}" ng-model="goal.BpmLow"></td>
      <td contentEditable ng-change="goals.update(goal)" ng-model-options="{updateOn : 'change blur'}" ng-model="goal.BpmHigh"></td>
      <td contentEditable ng-change="goals.update(goal)" ng-model-options="{updateOn : 'change blur'}" ng-model="goal.Aim"></td>
      <td>{{goal.CountryId}}</td>
      <td>{{goal.Id}}</td>
      <td ng-click="goals.delete(goal)"><a>x</a></td>
    </tr>
    <tr>
    <td colspan="7"><h5>Add new goal</h5></td>
    </tr>
    <tr>
      <td contentEditable ng-model="goals.newGoal.Name"></td>
      <td contentEditable ng-model="goals.newGoal.BpmLow"></td>
      <td contentEditable ng-model="goals.newGoal.BpmHigh"></td>
      <td contentEditable ng-model="goals.newGoal.Aim"></td>
      <td>{{goals.newGoal.CountryId}}</td>
      <td>{{goals.newGoal.Id}}</td>
      <td><button ng-click="goals.create(goals.newGoal)" type="button" class="tiny round">Add new goal</button></td>
    </tr>
</table>
*/
