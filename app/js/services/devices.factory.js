angular
  .module("app")
  .factory('Devices', DevicesFactory);

DevicesFactory.$inject = ['Restangular', 'uuid2'];

function DevicesFactory(Restangular, uuid2) {
  var self = this;
  var devices = [];

  var devicesFactory = {
    loadDevices: loadDevices,
    getDevices: getDevices,
    loadDevice: loadDevice,
    loadDevicePlaylists: loadDevicePlaylists,
    provisionDevice: provisionDevice,
    disableDevice: disableDevice
  };

  return devicesFactory;

  function loadDevices() {
    return Restangular.all('devices').getList().then(loadDevicesComplete);

    function loadDevicesComplete(data, status, headers, config) {
      self.devices = data;
      return self.devices;
    }
  }

  function getDevices() {
    return devices;
  }

  function loadDevice(id) {
    return Restangular.one('devices', id).get().then(loadDeviceComplete);

    function loadDeviceComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadDevicePlaylists(id) {
    return Restangular.one('sync/playlists', id).get().then(loadDevicePlaylistsComplete);

    function loadDevicePlaylistsComplete(data, status, headers, config) {
      return data;
    }
  }

  function provisionDevice(deviceName, gymId) {
    var params = {
      DeviceName: deviceName,
      GymId: gymId,
      Id: uuid2.newuuid().toString()
    };
    return Restangular.one('devices/provision').post('', params).then(provisionDeviceComplete);

    function provisionDeviceComplete(data, status, headers, config) {
      return data;
    }
  }

  function disableDevice(id) {
    return Restangular.one('devices/disable', id).post().then(disableDeviceComplete);

    function disableDeviceComplete(data, status, headers, config) {
      return data;
    }

  }
}
