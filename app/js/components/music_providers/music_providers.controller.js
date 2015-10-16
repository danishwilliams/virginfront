angular.module("app.music_providers", []).controller('Music_providersController', function ($stateParams, MusicProviders) {
  var self = this;
  this.title = "Music Providers";
  this.id = $stateParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.music_providers) {
	  MusicProviders.loadMusicProviders().then(function(data) {
	    self.music_providers = data;
	  });  	
  }
});
