angular.module("app.dashboard", []).controller('DashboardController', function (PlaylistEdit, Users) {
  var self = this;
  this.title = "Dashboard";

  PlaylistEdit.loadPlaylists(4).then(function(data) {
    self.playlists = data;
  });

  Users.loadCurrentUser().then(function(data) {
    self.gyms = data.UserGyms;
  });

});
