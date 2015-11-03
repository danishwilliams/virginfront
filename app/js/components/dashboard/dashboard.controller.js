angular.module("app.dashboard", []).controller('DashboardController', function (Playlists, Users) {
  var self = this;
  this.title = "Dashboard";

  Playlists.loadPlaylists(4).then(function(data) {
    self.playlists = data;
  });

  Users.loadCurrentUser().then(function(data) {
    self.gyms = data.UserGyms;
  });

});
