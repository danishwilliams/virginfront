angular.module("app.devices", []).controller('DevicesController', function (Devices) {
  var self = this;
  this.title = "Devices";

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.devices) {
	  Devices.loadDevices().then(function(data) {
	    self.devices = data;
	  });  	
  }

  this.update = function (device) {
    device.put();
  };
});
