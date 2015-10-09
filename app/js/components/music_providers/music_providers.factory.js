angular
  .module("app")
  .factory('MusicProviders', MusicProvidersFactory);

MusicProvidersFactory.$inject = ['Restangular'];

function MusicProvidersFactory(Restangular) {
  var self = this;
  var musicProviders = [];

  var musicProvidersFactory = {
    loadMusicProviders: loadMusicProviders,
    getMusicProviders: getMusicProviders,
    loadUser: loadUser
  };

  return musicProvidersFactory;

  function loadMusicProviders() {
    return Restangular.all('musicProviders').getList().then(loadMusicProvidersComplete);

    function loadMusicProvidersComplete(data, status, headers, config) {
      self.musicProviders = data;
      return self.musicProviders;
    }
  }

  function getMusicProviders() {
    return musicProviders;
  }

  function loadUser(id) {
    return Restangular.one('musicProviders', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }
}
