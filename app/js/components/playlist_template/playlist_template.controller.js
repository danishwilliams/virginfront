angular.module("app.playlist_template", []).controller('Playlist_templateController', function (Playlists, Templates, spinnerService) {
  var self = this;
  Playlists.setStep(0);
  Playlists.setPlaylist([]);

  Templates.loadTemplateGroups().then(function (data) {
    self.templateGroups = data;
    spinnerService.hide('playlistTemplateSpinner');
  });
});
