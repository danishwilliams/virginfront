angular.module("app.tracks", []).controller('TracksController', function ($routeParams, Tracks) {
  var self = this;
  this.title = "Tracks";
  this.id = $routeParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.tracks) {
	  Tracks.loadTracks().then(function(data) {
	    self.tracks = data;
	  });  	
  }
});
