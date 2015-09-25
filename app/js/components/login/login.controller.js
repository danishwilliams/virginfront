angular.module("app.login", [])
  .controller('LoginController', LoginController);

LoginController.$inject = ['$location', 'AuthenticationService'];

function LoginController($location, AuthenticationService) {
  this.credentials = { username: "", password: "" };

  var onLoginSuccess = function() {
    console.log('onLoginSuccess');
    $location.path('/playlist-create');
  };

  this.login = function() {
    AuthenticationService.login(this.credentials).success(onLoginSuccess);
  };
}