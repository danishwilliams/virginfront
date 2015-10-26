angular.module("app.users", []).controller('UsersController', function ($stateParams, Users) {
  var self = this;
  this.title = "Users";
  this.id = $stateParams.id;

  Users.loadUsers().then(function (data) {
    self.users = data;
  });

  this.update = function (user) {
    user.put();
  };
});
