angular
  .module("app")
  .factory('Sync', SyncFactory);

SyncFactory.$inject = ['LoggedInRestangular'];

function SyncFactory(LoggedInRestangular) {
  var self = this;

  var syncFactory = {
    loadDevicePlaylists: loadDevicePlaylists,
    loadDevicePlaylistQueue: loadDevicePlaylistQueue
  };

  return syncFactory;

  function loadDevicePlaylists(id) {
    return LoggedInRestangular.all('sync/playlists', id).getList().then(loadDevicePlaylistsComplete);

    function loadDevicePlaylistsComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadDevicePlaylistQueue(id) {
    return LoggedInRestangular.all('sync/playlistsyncqueue', id).getList().then(loadDevicePlaylistQueueComplete);

    function loadDevicePlaylistQueueComplete(data, status, headers, config) {
      return data;
    }
  }

}
