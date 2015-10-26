angular.module("app.device", []).controller('DeviceController', function ($stateParams, Devices) {
  var self = this;
  this.title = "Device";
  this.id = $stateParams.id;

  Devices.loadDevice(this.id).then(function(data) {
    self.device = data;
  });
  Devices.loadDevicePlaylists(this.id).then(function(data) {
    self.playlists = data;
  });

  this.update = function (device) {
    device.put();
  };
});
