angular.module("app.dashboard", []).controller('DashboardController', function (Playlists, spinnerService, $timeout, Users, USER_STATES, $state) {
  var self = this;

  // Handle various onboarding cases i.e. user has just logged in but is in some part of onboarding
  var user = Users.getCurrentUser();
  if (user.State === USER_STATES.onboarding_clubs || user.State === USER_STATES.invite_emailed || user.State === USER_STATES.invite_email_failed) {
    $state.go('onboarding-gyms');
    return;
  }
  else if (user.State === USER_STATES.onboarding_genres) {
    $state.go('onboarding-genres');
    return;
  }

  Playlists.loadPlaylists(4).then(function (data) {
    self.playlists = data;
    spinnerService.hide('dashboardPlaylistsSpinner');
    //spinnerService.hide('dashboardSharedSpinner');
  });

  self.loadGyms = function() {
    Playlists.loadGymsPlaylistSyncInfoDetailed().then(function (data) {
      spinnerService.hide('dashboardGymsSpinner');
      self.gyms = data;
    });
  };

  self.loadGyms();

  Playlists.loadRecentClasses(4).then(function (data) {
    self.classes = data;
    spinnerService.hide('dashboardClassesSpinner');
  });
});
