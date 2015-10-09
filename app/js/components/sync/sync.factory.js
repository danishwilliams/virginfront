angular
  .module("app")
  .factory('Sync', SyncFactory);

SyncFactory.$inject = ['Restangular'];

function SyncFactory(Restangular) {
  var self = this;
  var sync = [];

  var syncFactory = {
    loadSync: loadSync,
    getSync: getSync,
    loadUser: loadUser
  };

  return syncFactory;

  function loadSync() {
    return Restangular.all('sync').getList().then(loadSyncComplete);

    function loadSyncComplete(data, status, headers, config) {
      self.sync = data;
      return self.sync;
    }
  }

  function getSync() {
    return sync;
  }

  function loadUser(id) {
    return Restangular.one('sync', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }
}
