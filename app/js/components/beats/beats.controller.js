angular.module("app.beats", []).controller('BeatsController', function (Beats) {
  var self = this;

  Beats.loadBeats().then(function(data) {
    self.beats = data;
  });
});
