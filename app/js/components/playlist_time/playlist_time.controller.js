angular.module("app.playlist_time", []).controller('Playlist_timeController', function ($stateParams, PlaylistEdit, Templates) {
  var self = this;
  PlaylistEdit.setStep(1);
  this.title = "Select your time";
  this.id = $stateParams.id;

  Templates.loadTemplateGroupClasses(this.id).then(function (data) {
    self.templates = data.TemplateClassLength;
  });
});
