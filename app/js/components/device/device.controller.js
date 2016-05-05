angular.module("app.device", []).controller('DeviceController', function ($stateParams, Devices, spinnerService) {
  var self = this;
  this.id = $stateParams.id;

  // Load the device details
  Devices.loadDevice(this.id).then(function (data) {
    self.device = data;
    spinnerService.hide('device');
  });

  // Load the device sync log
  Devices.loadDeviceSyncLog(self.id, 1, 20).then(function (data) {
    self.synclog = data;
    spinnerService.hide('synclog');
  });

  // Load the device heartbeat log
  Devices.loadDeviceHeartbeatLog(self.id, 1, 20).then(function (data) {
    self.heartbeatlog = data;
    spinnerService.hide('heartbeatlog');
  });

  this.update = function (device) {
    device.put();
  };
});
