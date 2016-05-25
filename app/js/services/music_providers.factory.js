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
    loadMusicProvider: loadMusicProvider,
    getHeartbeatLog: getHeartbeatLog
  };

  return musicProvidersFactory;

  function loadMusicProviders() {
    return Restangular.all('musicproviders').getList().then(loadMusicProvidersComplete);

    function loadMusicProvidersComplete(data, status, headers, config) {
      self.musicProviders = data;
      return self.musicProviders;
    }
  }

  function getMusicProviders() {
    return musicProviders;
  }

  function loadMusicProvider(id) {
    return Restangular.one('musicproviders', id).get().then(loadMusicProviderComplete);

    function loadMusicProviderComplete(data, status, headers, config) {
      return data;
    }
  }

  function getHeartbeatLog(id, resultCount, page) {
    var params = {
      resultCount: resultCount,
      page: page
    };
    return Restangular.one('musicproviders/' + id + '/heartbeatlog').get(params).then(getHeartbeatLogComplete);

    function getHeartbeatLogComplete(data, status, headers, config) {
      data.forEach(function (val) {
        val.CreateDate = new Date(val.CreateDate);
      });
      return data;
    }
  }
}
