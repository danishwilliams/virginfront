angular.module("app.users", []).controller('UsersController', function ($stateParams, Users, uuid2, Restangular) {
  var self = this;
  this.id = $stateParams.id;

  Users.loadUsers().then(function (data) {
    self.users = data;
    // TODO: correctly show which roles this user has
  });

  this.update = function (user) {
    user.put();
  };

  self.sendInvite = function (id) {
    Users.sendInvite(id).then(function() {});
  };
});
