angular
  .module("app")
  .factory('Devices', DevicesFactory);

DevicesFactory.$inject = ['LoggedInRestangular'];

function DevicesFactory(LoggedInRestangular) {
  var self = this;
  var devices = [];

  var devicesFactory = {
    loadDevices: loadDevices,
    getDevices: getDevices,
    loadDevice: loadDevice,
    loadDevicePlaylists: loadDevicePlaylists
  };

  return devicesFactory;

  function loadDevices() {
    return LoggedInRestangular.all('devices').getList().then(loadDevicesComplete);

    function loadDevicesComplete(data, status, headers, config) {
      self.devices = data;
      return self.devices;
    }
  }

  function getDevices() {
    return devices;
  }

  function loadDevice(id) {
    return LoggedInRestangular.one('devices', id).get().then(loadDeviceComplete);

    function loadDeviceComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadDevicePlaylists(id) {
    return LoggedInRestangular.one('sync/playlists', id).get().then(loadDevicePlaylistsComplete);

    function loadDevicePlaylistsComplete(data, status, headers, config) {
      return data;
    }
  }
}
