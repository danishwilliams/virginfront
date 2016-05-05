angular.module("app.devices", []).controller('DevicesController', function (Devices, spinnerService) {
  var self = this;
  self.query = '';

  Devices.loadSyncStatus().then(function (data) {
    spinnerService.hide('devices');
    self.devices = data;
    console.log(data);
    data.forEach(function (val) {
      // Was there a syncing error?
      if (val.LatestSync.SyncSuccess === false) {
        val.error = true;
        val.timeAgoError = val.LastHeartbeat;
      }
      else {
        val.PlaylistSyncFailures.forEach(function(val1) {
          if (val1.SyncError && !val.timeAgoError) {
            val.error = true;
            val.timeAgoError = val1.CreateDate;
          }
        });
      }

      // What was the time ago?
      val.timeAgo = val.LastHeartbeat;
    });
  });

  self.deviceFilter = function(device) {
    self.query = self.query.toLowerCase();
    if (device.Device.Name && device.Device.Name.toLowerCase().indexOf(self.query) > -1) {
      return device;
    }
    else if (device.Device.Gym && device.Device.Gym.Name.toLowerCase().indexOf(self.query) > -1) {
      return device;
    }
  };

  this.update = function (device) {
    device.put();
  };
});
