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
    return Restangular.all('sync/playlists', id).getList();
  }

  function loadDevicePlaylistQueue(id) {
    return Restangular.all('sync/playlistsyncqueue', id).getList();
  }

}
