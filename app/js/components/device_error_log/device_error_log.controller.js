angular.module("app.device_error_log", []).controller('DeviceErrorLogController', function ($stateParams, Devices, spinnerService) {
  var self = this;
  this.id = $stateParams.id;

  Devices.loadDevice(self.id).then(function (data) {
    self.device = data;
  });

  Devices.loadDeviceErrorLog(self.id, 1, 20).then(function (data) {
    self.log = data;
    if (_.isEmpty(data)) {
      self.log = undefined;
    }
    spinnerService.hide('deviceErrors');
  });
});
