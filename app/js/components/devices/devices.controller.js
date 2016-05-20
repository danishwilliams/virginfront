angular.module("app.devices", []).controller('DevicesController', function ($stateParams, Devices, spinnerService) {
  var self = this;
  self.query = '';

  Devices.loadSyncStatus().then(function (data) {
    spinnerService.hide('devices');

    data.forEach(function (val) {
      // Was there a syncing error?
      if (val.LatestSync && val.LatestSync.SyncSuccess === false) {
        val.error = true;
        val.timeAgoError = val.LastHeartbeat;
      }
      else {
        if (val.PlaylistSyncFailures) {
          val.PlaylistSyncFailures.forEach(function(val1) {
            if (val1.SyncError && !val.timeAgoError) {
              val.error = true;
              val.timeAgoError = val1.CreateDate;
            }
          });
        }
      }

      // What was the time ago?
      val.timeAgo = val.LastHeartbeat;
    });

    // Showing different types of device listings: connected, disconnected, sync errors
    if ($stateParams.type) {
      var newData = [];
      data.forEach(function(val) {
        if (val.Connected && $stateParams.type === 'connected') {
          newData.push(val);
        }
        else if (!val.Connected && $stateParams.type === 'disconnected') {
          newData.push(val);
        }
        else if (val.error && $stateParams.type === 'syncerrors') {
          newData.push(val);
        }
      });
      data = newData;
    }

    self.devices = data;
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
