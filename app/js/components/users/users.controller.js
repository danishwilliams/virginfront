angular.module("app.users", []).controller('UsersController', function (Users, spinnerService) {
  var self = this;

  Users.loadUsers().then(function (data) {
    self.users = data;
    spinnerService.hide('users');

    // Hide non-instructor user types
    self.users.forEach(function(user) {
      user.Technical = false;
      user.UserUserTypes.forEach(function (type) {
        switch (type.UserType.Name) {
          case 'Admin':
          case 'API User':
          case 'Device':
          case 'Import':
            user.Technical = true;
        }
      });
    });
  });

  self.update = function (user) {
    user.put();
  };

  self.sendInvite = function (id) {
    Users.sendInvite(id).then(function() {});
  };
});
