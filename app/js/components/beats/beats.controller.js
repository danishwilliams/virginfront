angular.module("app.beats", []).controller('BeatsController', function (Beats) {
  var self = this;
  this.title = "Beats";

  Beats.loadBeats().then(function(data) {
    self.beats = data;
  });
});
