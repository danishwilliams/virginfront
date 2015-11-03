angular.module("app.playlist_template", []).controller('Playlist_templateController', function ($location, AuthenticationService, Playlists, Templates) {
  var self = this;
  Playlists.setStep(0);
  this.title = "Choose a Ride Template";

  // TODO: For caching in Restangular, see http://makandracards.com/makandra/29143-angular-caching-api-responses-in-restangular
  Templates.loadTemplateGroups(false).then(function (data) {
    self.templateGroups = data;
  });
});
