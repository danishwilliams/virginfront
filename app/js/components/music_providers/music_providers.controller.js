angular.module("app.music_providers", []).controller('Music_providersController', function (MusicProviders) {
  var self = this;

  if (!self.music_providers) {
	  MusicProviders.loadMusicProviders().then(function(data) {
	    self.music_providers = data;
	  });  	
  }
});
