angular.module("app.playlist_time", []).controller('Playlist_timeController', function ($routeParams, PlaylistEdit, Templates) {
  var self = this;
  PlaylistEdit.setStep(1);
  this.title = "Select your time";
  this.id = $routeParams.id;

  Templates.loadTemplateGroupClasses(this.id).then(function (data) {
  	console.log(data);
    self.templates = data.TemplateClassLength;
  });
});


