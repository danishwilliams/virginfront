angular.module("app.device", []).controller('DeviceController', function ($stateParams, Devices, Heartbeat, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  self.page = 1;
  self.synclog = [];
  loadDeviceSyncLog();

  Devices.loadDevice(self.id).then(function (data) {
    self.device = data;
    spinnerService.hide('device');
  });

  // Load the device heartbeat
  Devices.loadDeviceHeartbeatLog(self.id, 10).then(function (data) {
    var log = Heartbeat.createHeartbeat(data);
    self.heartbeat = log.heartbeat;
    self.hasHeartbeat = log.hasHeartbeat;
    self.newDay = log.newDay;
    self.newDayIndex = log.newDayIndex;
  });

  function loadDeviceSyncLog() {
    spinnerService.show('synclog');
    // Load the device sync log
    Devices.loadDeviceSyncLog(self.id, self.page, 20).then(function (data) {
      if (self.page === 1) {
        self.synclog = data;
      }
      else if (self.synclog.DeviceSyncPlaylistSyncs) {
        self.synclog.DeviceSyncPlaylistSyncs = self.synclog.DeviceSyncPlaylistSyncs.concat(data.DeviceSyncPlaylistSyncs);
      }
      // Prevents us getting caught in an infinite load cycle when there's nothing more to load
      if (self.synclog.DeviceSyncPlaylistSyncs && self.count < self.synclog.DeviceSyncPlaylistSyncs.length) {
        self.loadingMore = false;
      }
      spinnerService.hide('synclog');

      // There are 5 possible sync states:
      // Sync cycle failure (failed to sync, i.e. SyncSuccess = false)
      // Playlist sync error (sync completed, but with playlist sync errors)
      // Sync is in progress
      // Sync cycle didn't complete
      // Sync cycle is complete

      var i = 0;
      if (!self.synclog.DeviceSyncPlaylistSyncs) {
        return;
      }
      self.synclog.DeviceSyncPlaylistSyncs.forEach(function (val) {
        val.timeAgo = val.DeviceSync.CreateDate;

        // Work out how long the device took to sync in this sync cycle
        if (val.DeviceSync.SyncEndDate) {
          val.timeSyncTook = Math.floor((new Date(val.DeviceSync.SyncEndDate) - new Date(val.DeviceSync.CreateDate)) / 1000);
        }

        if (val.DeviceSync.SyncSuccess === false) {
          // Sync cycle failure
          val.syncFailure = true;
        } else {
          // Loop through DevicePlaylistSyncs to see if there's an error
          val.DevicePlaylistSyncs.forEach(function (val1) {
            if (val1.SyncError && !val.playlistSyncError) {
              // Playlist sync error
              val.playlistSyncError = true;

              // Convert the error string into a JSON object
              if (!_.isEmpty(val1.JsonObject)) {
                var errors = JSON.parse(val1.JsonObject);
                val1.DownloadErrorTracks = errors.DownloadErrorTracks;
                val1.GetLinkErrorTracks = errors.GetLinkErrorTracks;
              }
            }
          });
        }
        if (!val.playlistSyncError && !val.syncFailure) {
          if (!val.DeviceSync.SyncEndDate) {
            if (i === 0) {
              // Sync is in progress
              val.syncInProgress = true;
            } else {
              // Sync cycle didn't complete
              val.syncIncomplete = true;
            }
          } else {
            // Sync cycle is complete
            val.syncSuccess = true;
          }
        }
        i++;
      });
    });
  }

  // Load the device heartbeat log
  Devices.loadDeviceHeartbeatLog(self.id, 1, 20).then(function (data) {
    self.heartbeatlog = data;
    spinnerService.hide('heartbeatlog');
  });

  self.popoverContents = function (beat) {
    if (beat.beat) {
      return 'CONNECTED';
    }
    return 'DISCONNECTED';
  };

  self.loadMoreLogs = function () {
    if (!self.loadingMore) {
      self.loadingMore = true;
    }
    else {
      return;
    }
    self.count = 0;
    if (self.synclog.DeviceSyncPlaylistSyncs) {
      self.count = self.synclog.DeviceSyncPlaylistSyncs.length;
    }
    self.page++;
    loadDeviceSyncLog();
  };
});
