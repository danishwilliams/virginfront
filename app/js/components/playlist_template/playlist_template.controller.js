angular.module("app.playlist_template", []).controller('Playlist_templateController', function ($location, AuthenticationService, PlaylistEdit, Templates) {
  var self = this;
  PlaylistEdit.setStep(0);
  this.title = "Choose a Ride Template";

  // TODO: For caching in Restangular, see http://makandracards.com/makandra/29143-angular-caching-api-responses-in-restangular
  Templates.loadTemplates(false).then(function (data) {
    self.templates = data;
  });
});
