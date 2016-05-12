/**
 * Does duty both as onboarding and password reset
 */
angular.module("app.onboarding", []).controller('OnboardingController', function ($stateParams, $state, Genres, Gyms, Users, Storage, USER_STATES, spinnerService) {
  var self = this;
  self.saving = false;

  // Because this controller handles both onboarding and password reset
  if ($state.current.name !== 'passwordreset') {
    self.onboarding = true;
  }

  if ($state.current.name === 'onboarding-get-started' || $state.current.name === 'passwordreset') {
    Storage.removeItem('onboarding' + Users.getCurrentUser().Id);
  }

  // Grab the user's account
  if ($state.current.name === 'onboarding' || $state.current.name === 'passwordreset') {
    // We need to be able to get to this point WITHOUT being logged in.

    var token = $stateParams.token;

    // Use this token as our authentication
    Users.setAccessToken(token);
    Users.loadCurrentUser(token).then(function(data) {
      self.user = data;
      if ($state.current.name === 'onboarding') {
        // Set onboarding status
        Storage.setItem('onboarding'  + self.user.Id, true);
      }
    }, function(res) {
      self.tokenFailed = true;
    });
  }
  else {
    self.user = Users.getCurrentUser();
  }

  switch ($state.current.name) {
  case 'onboarding-genres':
    Genres.loadGenres().then(function (data) {
      spinnerService.hide('obGenresSpinner');
      self.genres = data;
    });
    break;
  case 'onboarding-gyms':
    Gyms.loadGyms().then(function (data) {
      spinnerService.hide('obGymsSpinner');
      self.gyms = data;

      // Mark the user gyms which have been chosen
      _.mapObject(self.gyms, function (val, key) {
        if (key >= 0) {
          var item = _.find(self.user.UserGyms, function (item) {
            return item.Gym.Name === val.Name;
          });
          if (item) {
            val.selected = true;
          }
        }
        return val;
      });

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

    self.saving = true;

    // Save password and go to the dashboard
    Users.changePassword(self.password).then(function() {

      // delete the onboarding token
      Users.deleteAccessToken(token).then(function() {
        var user = Users.getCurrentUser();
        // Get a new login token (i.e. post username and password to api/auth)
        Users.loadAccessToken({username: user.Username, password: self.password}).then(function(data) {
          // Save new login token in local storage
          Users.setAccessToken(data);

          // If this is a password reset, skip onboarding and go to the dashboard
          if ($state.current.name === 'passwordreset') {
            if (user.State === USER_STATES.onboarding_clubs || user.State === USER_STATES.invite_emailed || user.State === USER_STATES.invite_email_failed) {
              $state.go('onboarding-gyms');
              return;
            }
            else if (user.State === USER_STATES.onboarding_genres) {
              $state.go('onboarding-genres');
              return;
            }
            else {
              $state.go('dashboard');
              return;
            }
          }

          // Update the user state
          self.user.State = USER_STATES.onboarding_clubs;
          self.user.route = "users";
          self.user.put();
          Users.setCurrentUserState(USER_STATES.onboarding_clubs);

          if (!_.isEmpty(user.UserUserTypes)) {
            $state.go('onboarding-gyms');
          }
          else {
            // This is a user with no roles
            $state.go('registered');
          }
        });
      });
    });
  };

  self.save_gyms = function () {
    self.saving = true;

    // Update the user state
    self.user.State = USER_STATES.onboarding_genres;
    Users.setCurrentUserState(USER_STATES.onboarding_genres);

    self.user.UserGyms = [];
    self.gyms.forEach(function (val) {
      if (val.selected) {
        self.user.UserGyms.push({
          Gym: val,
          GymId: val.Id
        });
      }
    });

    self.user.put().then(function() {
      $state.go('onboarding-genres');
    });
  };

  self.save_genres = function () {
    self.saving = true;

    // Update the user state to say we're registered
    self.user.State = USER_STATES.registered;
    Users.setCurrentUserState(USER_STATES.registered);

    // Replace the genres in the userobject for saving
    self.user.UserGenres = [];
    self.genres.forEach(function (val) {
      if (val.selected) {
        self.user.UserGenres.push({
          Genre: val,
          GenreId: val.Id
        });
      }
    });

    self.user.put().then(function() {
      $state.go('onboarding-get-started');
    });
  };
});
