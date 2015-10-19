angular.module("app.users", []).controller('UsersController', function ($stateParams, Users) {
  var self = this;
  this.title = "Users";
  this.id = $stateParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.users) {
    Users.loadUsers().then(function(data) {
      self.users = data;
    });
  }

  this.update = function (user) {
    user.put();
  };
});
