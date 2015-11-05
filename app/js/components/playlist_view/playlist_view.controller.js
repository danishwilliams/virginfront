angular.module("app.playlist_view", []).controller('Playlist_viewController', function ($stateParams, $location, AuthenticationService, Playlists, Tracks) {
  var self = this;
  Playlists.setStep(4);
  self.id = $stateParams.id;
  self.playlist = Playlists.getPlaylist();

  if (self.id) {
    // Load an existing playlist
    Playlists.loadPlaylist(self.id).then(function () {
      self.playlist = Playlists.getPlaylist();
    });
  }

  self.playTrack = function (track, sortOrder) {
    Tracks.playTrack(track, sortOrder);
  };

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
