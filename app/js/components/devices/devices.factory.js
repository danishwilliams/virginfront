angular
  .module("app")
  .factory('Devices', DevicesFactory);

DevicesFactory.$inject = ['Restangular'];

function DevicesFactory(Restangular) {
  var self = this;
  var devices = [];

  var devicesFactory = {
    loadDevices: loadDevices,
    getDevices: getDevices,
    loadDevice: loadDevice
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
}
