angular.module("app.device_playlists", []).controller('DevicePlaylistsController', function ($stateParams, Devices) {
  var self = this;
  this.id = $stateParams.id;

  Devices.loadDevicePlaylists(this.id).then(function (data) {
    self.playlists = [];
    data.forEach(function(val) {
      self.playlists.push(val.Playlist);
    });
  });
});
