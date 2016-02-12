angular.module("app.registered", []).controller('RegisteredController', function(Users, $state) {
  var user = Users.getCurrentUser();
  if (!_.isEmpty(user.UserUserTypes)) {
    $state.go('dashboard');
  }
});