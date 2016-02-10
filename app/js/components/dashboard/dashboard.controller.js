angular.module("app.dashboard", []).controller('DashboardController', function (Playlists, spinnerService) {
  var self = this;

  Playlists.loadPlaylists(4).then(function (data) {
    self.playlists = data;
    spinnerService.hide('dashboardPlaylistsSpinner');
    //spinnerService.hide('dashboardSharedSpinner');
  });

  Playlists.loadGymsPlaylistSyncInfoDetailed().then(function (data) {
    spinnerService.hide('dashboardGymsSpinner');
    self.gyms = data;
  });

  Playlists.loadRecentClasses(4).then(function (data) {
    self.classes = data;
    spinnerService.hide('dashboardClassesSpinner');
  });
});
