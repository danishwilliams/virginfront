angular.module("app.beats", []).controller('BeatsController', function (Beats) {
  var self = this;
  this.title = "Beats";

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.beats) {
	  Beats.loadBeats().then(function(data) {
	    self.beats = data;
	  });
	}
});
