angular.module("app.playlists", []).controller('PlaylistsController', function (Playlists, spinnerService) {
  var self = this;
  this.playlists = Playlists.getPlaylists();

  Playlists.loadPlaylists(100).then(function(data) {
    self.playlists = data;
    spinnerService.hide('playlistsSpinner');
  });

});