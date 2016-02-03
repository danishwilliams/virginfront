angular.module("app.dashboard", []).controller('DashboardController', function (Playlists, spinnerService, $interval, $scope) {
  var self = this;
  this.title = "Dashboard";

  Playlists.loadPlaylists(4).then(function (data) {
    self.playlists = data;
    spinnerService.hide('dashboardPlaylistsSpinner');
    //spinnerService.hide('dashboardSharedSpinner');
  });

  Playlists.loadGymsPlaylistSyncInfoDetailed().then(function (data) {
    spinnerService.hide('dashboardGymsSpinner');
    self.gyms = data;
  });

  // Should probably put this into a gyms_rides directive (which then calls the gym_rides directive) so that
  // we don't have to inject $scope into this controller. Urgh.
  var intervalPromise = $interval(function () {
    Playlists.loadGymsPlaylistSyncInfoDetailed().then(function (data) {
      self.gyms = data;
    });
  }, 15000);

  // Cancel the interval when navigating away from the page
  // @see http://stackoverflow.com/questions/21364480/in-angular-how-to-use-cancel-an-interval-on-user-events-like-page-change
  $scope.$on('$destroy', function () {
    $interval.cancel(intervalPromise);
  });

  Playlists.loadRecentClasses(4).then(function (data) {
    self.classes = data;
    spinnerService.hide('dashboardClassesSpinner');
  });
});
