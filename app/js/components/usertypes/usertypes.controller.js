/*
angular.module("app.usertypes", []).controller('UsertypesController', function ($stateParams, UserTypes, uuid2, Restangular) {
  var self = this;
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

<h1>User Types</h1>

<table>
  <thead>
    <tr>
      <td>User Type</td>
      <td>Id</td>
      <td>Action</td>
    </tr>
  </thead>
  <tbody>
    <tr ng-repeat="usertype in usertypes.usertypes | orderBy:'Name'">
      <td>{{usertype.Name | translate}}</td>
      <td>{{usertype.Id}}</td>
      <td></td>
    </tr>
    <tr>
      <td colspan="3">
        <h5>Add new user type</h5></td>
    </tr>
    <tr>
      <td contentEditable ng-model="usertypes.newUserType.Name"></td>
      <td contentEditable ng-model="usertypes.newUserType.Id"></td>
      <td><button ng-click="usertypes.create()" type="button" class="tiny round">Add new user type</button></td>
    </tr>
  </tbody>
</table>

*/