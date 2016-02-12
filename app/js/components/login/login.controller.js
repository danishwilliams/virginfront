angular.module("app.login", [])
  .controller('LoginController', LoginController);

LoginController.$inject = ['$state', 'Users', 'spinnerService'];

function LoginController($state, Users, spinnerService) {
  var self = this;
  this.credentials = {
    username: "",
    password: ""
  };
  //b2c_login_check();

  var onLoginSuccess = function () {
    console.log('onLoginSuccess');
    spinnerService.hide('loginSpinner');
    if (!_.isEmpty(Users.getCurrentUser().UserUserTypes)) {
      $state.go('dashboard');
    }
    else {
      // This is a user with no roles
      $state.go('registered');
    }
  };

  this.login = function () {
    if (!this.credentials.username || !this.credentials.password) {
      return;
    }
    self.error = false;
    spinnerService.show('loginSpinner');
    Users.loadAccessToken(self.credentials).then(function (data) {
      Users.setAccessToken(data);
      Users.loadCurrentUser().then(onLoginSuccess, function () {
        spinnerService.hide('loginSpinner');
        self.error = {
          error: true
        };
      });
    }, function () {
      spinnerService.hide('loginSpinner');
      self.error = {
        error: true
      };
    });
  };

  // If a user has tried to log in via B2C, we get a #id_token value back
  function b2c_login_check() {
    var b2c_token = $location.hash();
    if (b2c_token.substr(0, 8) === 'id_token') {
      console.log(b2c_token);
      b2c_token = b2c_token.substr(9);
      if (b2c_token.length > 10) {
        $location.hash('');
        self.login();
      }
    }
  }
}
