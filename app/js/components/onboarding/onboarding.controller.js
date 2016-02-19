/**
 * Does duty both as onboarding and password reset
 */
angular.module("app.onboarding", []).controller('OnboardingController', function ($stateParams, $state, Genres, Gyms, Users) {
  var self = this;

  var token = $stateParams.token;

  // We need to be able to get to this point WITHOUT being logged in.

  // Use this token as our authentication
  Users.setAccessToken(token);
  Users.setOnboardingStatus(true);

  // Grab the user's account
  Users.loadCurrentUser(token).then(function(data) {
    self.user = data;
  }, function(res) {
    self.tokenFailed = true;
  });

  switch ($state.current.name) {
  case 'onboarding-genres':
    Genres.loadGenres().then(function (data) {
      self.genres = data;
    });
    break;
  case 'onboarding-gyms':
    Gyms.loadGyms().then(function (data) {
      self.gyms = data;
    });
    break;
  case 'onboarding-genres':
    Genres.loadGenres().then(function (data) {
      self.genres = data;
    });
    break;
  }

  self.save_password = function () {
    // check that passwords match
    if (self.password !== self.password1) {
      return;
    }

    // Save password and go to the dashboard
    Users.changePassword(self.password).then(function() {
      Users.setOnboardingStatus(false);

      // delete the onboarding token
      Users.deleteAccessToken(token).then(function() {
        var user = Users.getCurrentUser();
        // Get a new login token (i.e. post username and password to api/auth)
        Users.loadAccessToken({username: user.Username, password: self.password}).then(function(data) {
          // Save new login token in local storage
          Users.setAccessToken(data);

          // If this is a password reset, skip onboarding and go to the dashboard
          if ($state.current.name === 'resetpassword') {
            $state.go('dashboard');
            return;
          }

          // Update the user state to say we're registered
          self.user.State = 'registered';
          self.user.route = "users";
          self.user.put();

          if (!_.isEmpty(user.UserUserTypes)) {
            $state.go('dashboard');
          }
          else {
            // This is a user with no roles
            $state.go('registered');
          }
          //$state.go('onboarding-gyms', {
          //  id: self.id
          //});
        });
      });
    });
  };

  self.save_gyms = function () {
    console.log(self.gyms);

    // TODO: find all selected gyms

    // TODO: save the user with the selected gyms

    $state.go('onboarding-genres', {
      id: self.id
    });
  };

  self.save_genres = function () {
    $state.go('onboarding-get-started', {
      id: self.id
    });
  };
});
