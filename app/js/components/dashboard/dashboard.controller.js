angular.module("app.dashboard", []).controller('DashboardController', function (Playlists, spinnerService, $timeout) {
  var self = this;

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
