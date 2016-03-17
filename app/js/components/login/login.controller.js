angular.module("app.login", [])
  .controller('LoginController', LoginController);

LoginController.$inject = ['$state', 'Users', 'spinnerService', 'USER_STATES'];

function LoginController($state, Users, spinnerService, USER_STATES) {
  var self = this;
  this.credentials = {
    username: "",
    password: ""
  };
  //b2c_login_check();
  self.step = 'login';

  var onLoginSuccess = function () {
    console.log('onLoginSuccess');
    spinnerService.hide('loginSpinner');
    var user = Users.getCurrentUser();
    if (!_.isEmpty(user.UserUserTypes)) {
      // Handle various onboarding cases i.e. user has just logged in but is in some part of onboarding
      if (user.State === USER_STATES.onboarding_clubs) {
        $state.go('onboarding-gyms');
      }
      else if (user.State === USER_STATES.onboarding_genres) {
        $state.go('onboarding-genres');
      }
      else {
        $state.go('dashboard');
      }
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

  self.forgotClicked = function() {
    Users.removeLocalAccessToken();
    self.step = 'forgot';
  };

  self.forgotPassword = function() {
    if (!self.credentials.username) {
      return;
    }

    self.forgotPasswordSubmit = true;
    self.emailNotFoundError = false;
    self.forgotPasswordError = false;

    Users.resetPassword(self.credentials.username).then(function() {
      self.forgotPasswordSubmit = false;
      self.step = 'resetSuccess';
    }, function(res) {
      self.forgotPasswordSubmit = false;
      if (res.data.Message === 'Email address not found') {
        self.emailNotFoundError = true;
      }
      else {
        // Some generic error
        self.forgotPasswordError = true;
      }
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
