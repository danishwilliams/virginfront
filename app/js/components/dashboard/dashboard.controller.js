angular.module("app.dashboard", []).controller('DashboardController', function (Playlists, spinnerService) {
  var self = this;
  this.title = "Dashboard";

  Playlists.loadPlaylists(4).then(function(data) {
    self.playlists = data;
    spinnerService.hide('dashboardPlaylistsSpinner');
    //spinnerService.hide('dashboardSharedSpinner');
  });

  Playlists.loadGymsPlaylistSyncInfoDetailed().then(function(data) {
    self.gyms = data;
    spinnerService.hide('dashboardGymsSpinner');
  });

});
