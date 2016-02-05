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

  this.create = function() {
    self.newUser.Username = self.newUser.Email;
    Restangular.one("users", self.newUser.Id).customPUT(self.newUser).then(function() {
      self.users.push(self.newUser);
      self.createBlankUser();
    });
  };

  this.createBlankUser = function() {
    self.newUser = {
      Id: uuid2.newuuid().toString()
    };
  };

  self.createBlankUser();
});
