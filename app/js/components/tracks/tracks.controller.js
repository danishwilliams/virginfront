angular.module("app.tracks", []).controller('TracksController', function ($stateParams, TracksFactory) {
  var self = this;
  this.title = "Tracks";
  this.id = $stateParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.tracks) {
    TracksFactory.loadTracks().then(function (data) {
      self.tracks = data;
    });
  }
});
