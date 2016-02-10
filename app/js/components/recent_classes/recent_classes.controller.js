angular.module("app.recent_classes", []).controller('Recent_classesController', function(Playlists, spinnerService) {
  var self = this;
  Playlists.loadRecentClasses(100).then(function (data) {
    self.classes = data;
    spinnerService.hide('classesSpinner');
  });
});