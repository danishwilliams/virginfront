angular.module("app.onboarding", []).controller('OnboardingController', function ($stateParams, $state, Genres, Gyms) {
  var self = this;

  this.id = $stateParams.id;

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

  this.save_password = function () {
    // TODO: check that passwords match
    // TODO: save password

    $state.go('onboarding-gyms', {
      id: self.id
    });
  };

  this.save_gyms = function () {
    console.log(self.gyms);

    // TODO: find all selected gyms

    // TODO: save the user with the selected gyms

    $state.go('onboarding-genres', {
      id: self.id
    });
  };

  this.save_genres = function () {
    $state.go('onboarding-get-started', {
      id: self.id
    });
  };
});
