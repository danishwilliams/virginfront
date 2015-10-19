angular.module("app.device", []).controller('DeviceController', function ($stateParams, Devices) {
  var self = this;
  this.title = "Device";
  this.id = $stateParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.device && this.id) {
	  Devices.loadDevice(this.id).then(function(data) {
	    self.device = data;
	  });
    Devices.loadDevicePlaylists(this.id).then(function(data) {
      self.playlists = data;
    });
  }

  this.update = function (device) {
    device.put();
  };
});
