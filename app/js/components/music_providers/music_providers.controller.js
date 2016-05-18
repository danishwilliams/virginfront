angular.module("app.music_providers", []).controller('Music_providersController', function (MusicProviders) {
  var self = this;

  MusicProviders.loadMusicProviders().then(function(data) {
    self.music_providers = data;
  });
});
