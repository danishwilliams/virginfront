angular.module("app.users", []).controller('UsersController', function (Users, spinnerService) {
  var self = this;

  Users.loadUsers().then(function (data) {
    self.users = data;
    spinnerService.hide('users');
  });

  self.update = function (user) {
    user.put();
  };

  self.sendInvite = function (id) {
    Users.sendInvite(id).then(function() {});
  };
});
