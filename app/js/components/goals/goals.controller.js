angular.module("app.goals", []).controller('GoalsController', function (Goals, Restangular, uuid2) {
  var self = this;
  this.goals = [];
  this.newGoal = {};

  Goals.getList().then(function (goals) {
    self.goals = goals;
  });

  this.update = function (goal) {
    console.log('put running!');
    goal.put();
  };

  this.delete = function (goal) {
    Restangular.one("goals", goal.Id).remove().then(function () {
      // Updating the list and removing the goal after the response is OK.
      var index = self.goals.indexOf(goal);
      if (index > -1) {
        self.goals.splice(index, 1);
      }
    });
  };

  this.create = function (goal) {
    if (!goal.Name || !goal.CountryId || !goal.BpmLow || !goal.BpmHigh) {
      console.log("Missing attributes on the goal");
      return;
    }
    Restangular.one("goals", goal.Id).customPUT(goal).then(function () {
      console.log('Push successful!');
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
      Aim: "",
      CountryId: "8c816daf-70b9-4ecf-b6df-16b5c80fbb31" // South Africa
    };
  };

  // TODO: refactor this module to use the Module Revealer pattern, so this code can come before the function
  self.createBlankGoal();
});
