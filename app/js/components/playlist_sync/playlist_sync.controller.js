angular.module("app.playlist_sync", []).controller('Playlist_syncController', function ($stateParams, $location, $state, AuthenticationService, Playlists) {
  var self = this;

  // TODO: do we want to sanitize this?
  this.id = $stateParams.id;

  this.title = "Sync a Ride";
  Playlists.setStep(5);

  self.publishPlaylist = function () {
    Playlists.publishPlaylist(self.id).then(function (data) {
      $state.go('dashboard');
    });
    Playlists.publishPlaylistToMusicProvider(self.id).then(function (data) {
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
