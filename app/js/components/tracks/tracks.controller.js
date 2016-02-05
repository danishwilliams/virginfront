angular.module("app.tracks", []).controller('TracksController', function (TracksFactory) {
  var self = this;

  TracksFactory.loadTracks().then(function (data) {
    self.tracks = data;
  });

  this.update = function (track) {
    track.put();
  };
});
