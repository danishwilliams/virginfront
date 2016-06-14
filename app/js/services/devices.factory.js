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
    loadDevicesForGym: loadDevicesForGym,
    provisionDevice: provisionDevice,
    disableDevice: disableDevice,
    loadSyncStatus: loadSyncStatus,
    loadDeviceSyncLog: loadDeviceSyncLog,
    loadDeviceHeartbeatLog: loadDeviceHeartbeatLog,
    loadDeviceErrorLog: loadDeviceErrorLog
  };

  return devicesFactory;

  function loadDevices() {
    return Restangular.all('devices').getList().then(function(data) {
      self.devices = data;
      return self.devices;
    });
  }

  function getDevices() {
    return devices;
  }

  function loadDevice(id) {
    return Restangular.one('devices', id).get();
  }

  function loadDevicePlaylists(id) {
    return Restangular.one('sync/playlists', id).get();
  }

  /**
   * Load all devices for a specific gym, but if excludeDeviceId is given, then exlude that device from the listing
   */
  function loadDevicesForGym(gymId, excludeDeviceId) {
    return Restangular.all('gyms/' + gymId + '/devices').getList().then(loadDevicesForGymComplete);

    function loadDevicesForGymComplete(data, status, headers, config) {
      var newData = {};

      // Exclude the device from the list, by creating a blank array and...
      var dataWithoutExcludedDevice = [];

      data.forEach(function (val) {
        if (excludeDeviceId && val.Id !== excludeDeviceId) {
          // ...only adding devices which don't match that device
          dataWithoutExcludedDevice.push(val);
        }
        if (val.Primary) {
          newData.HasPrimary = true;
        }
        else {
          newData.HasSecondary = true;
        }
      });
      if (excludeDeviceId) {
        data = dataWithoutExcludedDevice;
      }
      newData.data = data;
      return newData;
    }
  }

  /**
   * Provisions a new device
   *
   * @param deviceName
   *   String. Name of the new device
   * @param gymId
   *   UUID. The id of the gym this device belongs to.
   * @param isPrimary
   *   Boolean. If the device is primary or not
   */
  function provisionDevice(deviceName, gymId, isPrimary) {
    var params = {
      DeviceName: deviceName,
      GymId: gymId,
      Primary: isPrimary,
      Id: uuid2.newuuid().toString()
    };
    return Restangular.one('devices/provision').post('', params);
  }

  function disableDevice(id) {
    return Restangular.one('devices/disable', id).post();
  }

  function loadSyncStatus() {
    return Restangular.one('devices/status').get();
  }

  function loadDeviceSyncLog(id, page, resultCount) {
    var params = {
      page: page,
      resultCount: resultCount
    };
    return Restangular.one('devices/' + id + '/synclog').get(params);
  }

  function loadDeviceHeartbeatLog(id, sinceDays) {
    return Restangular.one('devices/' + id + '/heartbeatlog').get({
      sinceDays: sinceDays
    }).then(loadDeviceHeartbeatLogComplete);

    function loadDeviceHeartbeatLogComplete(data, status, headers, config) {
      data.forEach(function(val) {
        val.CreateDate = new Date(val.CreateDate);
      });
      return data;
    }
  }

  function loadDeviceErrorLog(id, page, resultCount) {
    var params = {
      page: page,
      resultCount: resultCount
    };
    return Restangular.one('devices/' + id + '/errorlog').get(params).then(loadDeviceErrorLogComplete);

    function loadDeviceErrorLogComplete(data, status, headers, config) {
      data.forEach(function(val) {
        val.ErrorDate = new Date(val.ErrorDate);
      });
      return data;
    }
  }
}
