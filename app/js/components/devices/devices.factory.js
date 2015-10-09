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
    loadUser: loadUser
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

  function loadUser(id) {
    return Restangular.one('devices', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }
}
