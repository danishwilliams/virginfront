angular.module("app.devices", []).controller('DevicesController', function (Devices) {
  var self = this;
  this.title = "Devices";

  Devices.loadDevices().then(function (data) {
    self.devices = data;
  });

  this.update = function (device) {
    device.put();
  };
});
