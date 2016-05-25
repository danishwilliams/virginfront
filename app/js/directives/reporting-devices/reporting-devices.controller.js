angular
  .module("app")
  .directive("reportingDevices", reportingDevices);

function reportingDevices() {
  var directive = {
    templateUrl: '../js/directives/reporting-devices/reporting-devices.html',
    restrict: 'E',
    controller: reportingDevicesController,
    controllerAs: 'vm'
  };
  return directive;
}

reportingDevicesController.$inject = ['Devices', 'spinnerService'];

function reportingDevicesController(Devices, spinnerService) {
  var self = this;

  Devices.loadSyncStatus().then(function (data) {
    spinnerService.hide('devicesSpinner');
    self.devices = {
      connected: 0,
      disconnected: 0,
      errors: 0
    };
    data.forEach(function (val) {
      var errorFound = false;
      if (val.Connected) {
        self.devices.connected++;
      }
      else {
        self.devices.disconnected++;        
      }

      if (val.LatestSync && val.LatestSync.SyncSuccess === false) {
        self.devices.errors++;
      }
      else {
        if (val.PlaylistSyncFailures) {
          val.PlaylistSyncFailures.forEach(function(val1) {
            if (val1.SyncError && !errorFound) {
              errorFound = true;
              self.devices.errors++;
            }
          });
        }
      }
    });
    self.devicesLoaded = true;
  });
}
