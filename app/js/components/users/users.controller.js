angular.module("app.users", []).controller('UsersController', function ($routeParams, Users) {
  var self = this;
  this.title = "Users";
  this.id = $routeParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.users) {
    Users.loadUsers().then(function(data) {
      self.users = data;
    });
  }
});
