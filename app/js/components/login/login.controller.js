angular.module("app.login", [])
  .controller('LoginController', LoginController);

LoginController.$inject = ['$location', '$stateParams', 'AuthenticationService'];

function LoginController($location, $stateParams, AuthenticationService) {
  var self = this;
  this.credentials = { username: "", password: "" };

  var onLoginSuccess = function() {
    console.log('onLoginSuccess');
    $location.path('/dashboard');
  };

  this.login = function() {
    AuthenticationService.login(this.credentials).success(onLoginSuccess);
  };

  // If a user has tried to log in via B2C, we get a #id_token value back
  this.b2c_login_check = function() {
    var b2c_token = $location.hash();
    if (b2c_token.substr(0,8) === 'id_token') {
      console.log(b2c_token);
      b2c_token = b2c_token.substr(9);
      if (b2c_token.length > 10) {
        $location.hash('');
        self.login();
      }
    }
  };

  self.b2c_login_check();
}
