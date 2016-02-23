angular.module("app.passwordreset", [])
  .controller('PasswordResetController', PasswordResetController);

PasswordResetController.$inject = ['$state', '$stateParams', 'Users', 'spinnerService'];

function PasswordResetController($state, $stateParams, Users, spinnerService) {
  var self = this;

  var token = $stateParams.token;

  // We need to be able to get to this point WITHOUT being logged in.

  // Use this token as our authentication
  Users.setAccessToken(token);

  // Grab the user's account
  Users.loadCurrentUser(token).then(function(data) {
    self.user = data;
  }, function(res) {
    self.tokenFailed = true;
  });

}
