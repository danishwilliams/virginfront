angular.module("app.devices", []).controller('DevicesController', function ($stateParams, Devices) {
  var self = this;
  this.title = "Devices";
  this.id = $stateParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.devices) {
	  Devices.loadDevices().then(function(data) {
	    self.devices = data;
	  });  	
  }
});
