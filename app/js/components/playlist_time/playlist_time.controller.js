angular.module("app.playlist_time", []).controller('Playlist_timeController', function ($stateParams, Playlists, Templates, spinnerService) {
  var self = this;
  Playlists.setStep(1);
  this.id = $stateParams.id;

  Templates.loadTemplateGroupClasses(this.id).then(function (data) {
    self.templates = data.TemplateClassLength;
    spinnerService.hide('playlistTimeSpinner');
  });

  Playlists.setCreatingNewPlaylist(true);
});
