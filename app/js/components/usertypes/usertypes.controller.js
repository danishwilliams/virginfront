angular.module("app.usertypes", []).controller('User_typesController', function ($routeParams, UserTypes) {
  var self = this;
  this.title = "User Types";
  this.id = $routeParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.usertypes) {
    UserTypes.loadUserTypes().then(function(data) {
      self.usertypes = data;
    });
  }
});
