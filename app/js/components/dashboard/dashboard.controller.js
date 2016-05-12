angular.module("app.dashboard", []).controller('DashboardController', function (Playlists, Users, spinnerService, USER_STATES, $state) {
  var self = this;

  // Handle various onboarding cases i.e. user has just logged in but is in some part of onboarding
  var user = Users.getCurrentUser();
  if (user.State === USER_STATES.invite_emailed) {
    var token = Users.getAccessToken();
    $state.go('onboarding', {token: token});
    return;
  }
  else if (user.State === USER_STATES.onboarding_clubs || user.State === USER_STATES.invite_email_failed) {
    $state.go('onboarding-gyms');
    return;
  }
  else if (user.State === USER_STATES.onboarding_genres) {
    $state.go('onboarding-genres');
    return;
  }

  self.loadGyms = function() {
    Playlists.loadGymsPlaylistSyncInfoDetailed().then(function (data) {
      spinnerService.hide('dashboardGymsSpinner');
      self.gyms = data;
    });
  };

  self.loadGyms();
});
