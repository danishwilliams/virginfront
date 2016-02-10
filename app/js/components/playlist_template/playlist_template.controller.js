angular.module("app.playlist_template", []).controller('Playlist_templateController', function (Playlists, Templates, spinnerService) {
  var self = this;
  Playlists.setStep(0);
  Playlists.setPlaylist([]);

  // TODO: For caching in Restangular, see http://makandracards.com/makandra/29143-angular-caching-api-responses-in-restangular
  Templates.loadTemplateGroups(false).then(function (data) {
    self.templateGroups = data;
    spinnerService.hide('playlistTemplateSpinner');
  });
});
