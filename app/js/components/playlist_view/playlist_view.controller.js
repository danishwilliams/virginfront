angular.module("app.playlist_view", []).controller('Playlist_viewController', function ($routeParams, $location, AuthenticationService, PlaylistEdit) {
  var self = this;
  PlaylistEdit.setStep(4);
  this.id = $routeParams.id;
  this.playlist = PlaylistEdit.getPlaylist();

  if (this.id) {
    // Load an existing playlist
    PlaylistEdit.loadPlaylist(this.id).then(function () {
      self.playlist = PlaylistEdit.getPlaylist();
    });
  }

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
