angular.module("app.tracks", []).controller('TracksController', function (TracksFactory) {
  var self = this;
  this.title = "Tracks";

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.tracks) {
    TracksFactory.loadTracks().then(function (data) {
      self.tracks = data;
    });
  }

  this.update = function (track) {
    track.put();
  };
});
