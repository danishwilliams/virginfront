angular.module("app.beats", []).controller('BeatsController', function ($stateParams, Beats) {
  var self = this;
  this.title = "Beats";
  this.id = $stateParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.beats) {
	  Beats.loadBeats().then(function(data) {
	    self.beats = data;
	  });
	}
});
