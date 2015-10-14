angular.module("app.playlist_time", []).controller('Playlist_timeController', function ($routeParams, PlaylistEdit, Templates) {
  var self = this;
  PlaylistEdit.setStep(1);
  this.title = "Select your time";
  this.id = $routeParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.templates) {
    Templates.loadTemplateGroupClasses(this.id).then(function (data) {
      self.templates = data.TemplateClassLength;
    });
  }
});
