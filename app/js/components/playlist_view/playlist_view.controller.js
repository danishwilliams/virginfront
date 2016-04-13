angular.module("app.playlist_view", []).controller('Playlist_viewController', function ($stateParams, $state, Users, Playlists, Tracks, spinnerService, Authorizer) {
  var self = this;
  Playlists.setStep(3);
  self.id = $stateParams.id;
  self.playlist = Playlists.getPlaylist();
  self.user = Users.getCurrentUser();

  if (self.playlist.Id !== self.id) {
    // We're loading up a new playlist, so self.playlist is an older cached version
    self.playlist = {};
  }

  if ($state.current.name === 'playlist-new-view') {
    // We're viewing a newly created playlist!
    self.newPlaylist = true;
  }

  if (self.id) {
    // Load an existing playlist
    Playlists.loadPlaylist(self.id).then(function () {
      self.playlist = Playlists.getPlaylist();
      // If playlist is incomplete, and it's my playlist, edit it
      if (!self.playlist.Complete && self.user.Id === self.playlist.UserId) {
        $state.go('playlist-edit', {id: self.id});
      }
      spinnerService.hide('playlistViewSpinner');
    });
  }

  // Show the edit link under certain conditions
  self.showEdit = function () {
    // If the current user created the playlist and has the editPlaylist permission
    if (self.playlist.UserId === self.user.Id) {
      return Authorizer.canAccess('editPlaylist', self.user);
    }
    else {
      // If the user has editAnyPlaylist permission
      return Authorizer.canAccess('editAnyPlaylist', self.user);
    }

    return false;
  };

  self.playTrack = function (track, sortOrder) {
    Tracks.playTrack(track, sortOrder);
  };

  this.checkPlaylistLength = function () {
    return Playlists.checkPlaylistLength();
  };

});
