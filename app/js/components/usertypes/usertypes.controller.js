angular.module("app.usertypes", []).controller('UsertypesController', function ($stateParams, UserTypes, uuid2, Restangular) {
  var self = this;
  this.title = "User Types";
  this.id = $stateParams.id;
  this.newUserType = {};

  UserTypes.loadUserTypes().then(function (data) {
    self.usertypes = data;
  });

  this.create = function () {
    Restangular.one("usertypes", self.newUserType.Id).customPUT(self.newUserType).then(function () {
      console.log('Push successful!');
      self.usertypes.push(self.newUserType);
      self.createBlankUserType();
    });
  };

  this.createBlankUserType = function () {
    self.newUserType = {
      Name: "",
      Id: uuid2.newuuid().toString()
    };
  };

  // TODO: refactor this module to use the Module Revealer pattern, so this code can come before the function
  self.createBlankUserType();
});
