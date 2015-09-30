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

  this.save = function (goal) {
    //console.log(goal);
    Restangular.one("goals", goal.Id).customPUT(goal).then(function () {
      console.log('Push successful!');
      self.goals.push(goal);
      self.createBlankGoal();
    });
  };

  this.createBlankGoal = function () {
    self.newGoal = {
      Name: "Blah",
      Id: uuid2.newuuid().toString(),
      BpmLow: "80",
      BpmHigh: "100",
      Aim: "Save this to the API!"
    };
  };

  // TODO: refactor this module to use the Module Revealer pattern, so this code can come before the function
  self.createBlankGoal();
});
