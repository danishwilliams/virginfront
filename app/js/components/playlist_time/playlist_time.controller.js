angular.module("app.playlist_time", []).controller('Playlist_timeController', function ($stateParams, Playlists, Templates) {
  var self = this;
  Playlists.setStep(1);
  this.title = "Select your time";
  this.id = $stateParams.id;

  Templates.loadTemplateGroupClasses(this.id).then(function (data) {
    self.templates = data.TemplateClassLength;
  });
});
