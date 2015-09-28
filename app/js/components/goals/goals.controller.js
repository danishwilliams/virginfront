angular.module("app.goals", []).controller('GoalsController', function (Goals) {
  var self = this;

  Goals.getList().then(function (goals) {
    self.goals = goals;
  });
});
