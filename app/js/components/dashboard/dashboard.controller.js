angular.module("app.dashboard", []).controller('DashboardController', function (Playlists) {
  var self = this;
  this.title = "Dashboard";

  Playlists.loadPlaylists().then(function(data) {
    self.playlists = data;
  });

});
