angular
  .module("app")
  .factory('Sync', SyncFactory);

SyncFactory.$inject = ['Restangular'];

function SyncFactory(Restangular) {
  var self = this;

  var syncFactory = {
    loadDevicePlaylists: loadDevicePlaylists,
    loadDevicePlaylistQueue: loadDevicePlaylistQueue
  };

  return syncFactory;

  function loadDevicePlaylists(id) {
    return Restangular.all('sync/playlists', id).getList().then(loadDevicePlaylistsComplete);

    function loadDevicePlaylistsComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadDevicePlaylistQueue(id) {
    return Restangular.all('sync/playlistsyncqueue', id).getList().then(loadDevicePlaylistQueueComplete);

    function loadDevicePlaylistQueueComplete(data, status, headers, config) {
      return data;
    }
  }

}
