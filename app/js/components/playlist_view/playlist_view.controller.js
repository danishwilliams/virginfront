angular.module("app.playlist_view", []).controller('Playlist_viewController', function ($stateParams, $state, $location, AuthenticationService, Playlists, Tracks, spinnerService) {
  var self = this;
  Playlists.setStep(3);
  self.id = $stateParams.id;
  self.playlist = Playlists.getPlaylist();

  if ($state.current.name === 'playlist-new-view') {
    // We're viewing a newly created playlist!
    self.newPlaylist = true;
  }

  if (self.id) {
    // Load an existing playlist
    Playlists.loadPlaylist(self.id).then(function () {
      self.playlist = Playlists.getPlaylist();
      spinnerService.hide('playlistViewSpinner');
      if (!self.newPlaylist && !self.checkPlaylistLength()) {
        $state.go('playlist-edit', {id: self.playlist.Id});
      }
    });
  }

  self.playTrack = function (track, sortOrder) {
    Tracks.playTrack(track, sortOrder);
  };

  this.checkPlaylistLength = function () {
    return Playlists.checkPlaylistLength();
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
