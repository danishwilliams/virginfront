angular.module("app.tracks", []).controller('TracksController', function ($routeParams, TracksFactory) {
  var self = this;
  this.title = "Tracks";
  this.id = $routeParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.tracks) {
    TracksFactory.loadTracks().then(function (data) {
      self.tracks = data;
    });
  }
});
