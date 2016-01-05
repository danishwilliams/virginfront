angular
  .module("app")
  .factory('MusicProviders', MusicProvidersFactory);

MusicProvidersFactory.$inject = ['LoggedInRestangular'];

function MusicProvidersFactory(LoggedInRestangular) {
  var self = this;
  var musicProviders = [];

  var musicProvidersFactory = {
    loadMusicProviders: loadMusicProviders,
    getMusicProviders: getMusicProviders,
    loadMusicProvider: loadMusicProvider
  };

  return musicProvidersFactory;

  function loadMusicProviders() {
    return LoggedInRestangular.all('musicProviders').getList().then(loadMusicProvidersComplete);

    function loadMusicProvidersComplete(data, status, headers, config) {
      self.musicProviders = data;
      return self.musicProviders;
    }
  }

  function getMusicProviders() {
    return musicProviders;
  }

  function loadMusicProvider(id) {
    return LoggedInRestangular.one('musicProviders', id).get().then(loadMusicProviderComplete);

    function loadMusicProviderComplete(data, status, headers, config) {
      return data;
    }
  }
}
