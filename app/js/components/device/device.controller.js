angular.module("app.device", []).controller('DeviceController', function ($stateParams, Devices, spinnerService) {
  var self = this;
  this.id = $stateParams.id;

  // Load the device details
  Devices.loadDevice(this.id).then(function (data) {
    self.device = data;
    spinnerService.hide('device');
  });

  // Load the device sync log
  Devices.loadDeviceSyncLog(self.id, 1, 20).then(function (data) {
    self.synclog = data;

    console.log(data);

    self.synclog.DeviceSyncPlaylistSyncs.forEach(function(val) {
      if (val.DeviceSync.SyncSuccess === false) {
        // Sync cycle failure
        val.syncFailure = true;
        val.timeAgo = val.DeviceSync.SyncEndDate;
      }
      else {
        // Loop through DevicePlaylistSyncs to see if there's an error
        val.DevicePlaylistSyncs.forEach(function(val1) {
          if (val1.SyncError && !val.playlistSyncError) {
            val.playlistSyncError = true;
            val.timeAgo = val1.CreateDate;
          }
        });
      }
      if (!val.playlistSyncError) {
        // Sync cycle is complete
        val.syncSuccess = true;
        val.timeAgo = val.DeviceSync.SyncEndDate;
      }
    });
    spinnerService.hide('synclog');
  });

  // Load the device heartbeat log
  Devices.loadDeviceHeartbeatLog(self.id, 1, 20).then(function (data) {
    self.heartbeatlog = data;
    spinnerService.hide('heartbeatlog');
  });

  this.update = function (device) {
    device.put();
  };
});
