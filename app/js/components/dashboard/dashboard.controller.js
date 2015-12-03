angular.module("app.dashboard", []).controller('DashboardController', function (Playlists, Users, spinnerService) {
  var self = this;
  this.title = "Dashboard";

  Playlists.loadPlaylists(4).then(function(data) {
    self.playlists = data;
    spinnerService.hide('dashboardPlaylistsSpinner');
    //spinnerService.hide('dashboardSharedSpinner');
  });

  Users.loadCurrentUser().then(function(data) {
    self.gyms = data.UserGyms;
    spinnerService.hide('dashboardGymsSpinner');
  });

});
