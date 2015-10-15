angular.module("app.playlist_view", []).controller('Playlist_viewController', function ($routeParams, $location, AuthenticationService, PlaylistEdit, Playlists) {
  var self = this;
  PlaylistEdit.setStep(4);
  self.id = $routeParams.id;
  self.playlist = PlaylistEdit.getPlaylist();

  if (self.id) {
    // Load an existing playlist
    PlaylistEdit.loadPlaylist(self.id).then(function () {
      self.playlist = PlaylistEdit.getPlaylist();
    });
  }

  self.publishPlaylist = function() {
    Playlists.publishPlaylist(self.playlist.Id).then(function (data) {
      console.log('successfully published playlist!');
      alert('Playlist successfully published!');
    });
    Playlists.publishPlaylistToMusicProvider(self.playlist.Id).then(function (data) {
      console.log('successfully published playlist to music provider!');
    });
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
