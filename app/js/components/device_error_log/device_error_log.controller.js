angular.module("app.device_error_log", []).controller('DeviceErrorLogController', function ($stateParams, Devices, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
});
