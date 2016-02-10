angular.module("app.device", []).controller('DeviceController', function ($stateParams, Devices) {
  var self = this;
  this.id = $stateParams.id;

  Devices.loadDevice(this.id).then(function (data) {
    self.device = data;
  });

  this.update = function (device) {
    device.put();
  };
});
