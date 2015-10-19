angular.module("app.onboarding", []).controller('OnboardingController', function ($stateParams, $state, Genres) {
  var self = this;
  this.title = "Onboarding";

  this.id = $stateParams.id;

  if ($state.current.name === 'onboarding-genres') {
    Genres.loadGenres().then(function (data) {
      self.genres = data;
    });
  }

  this.save_password = function () {
    $state.go('onboarding-clubs', {
      id: self.id
    });
  };
});
