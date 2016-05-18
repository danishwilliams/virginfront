angular.module("app.device", []).controller('DeviceController', function ($stateParams, Devices, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  self.page = 1;
  self.synclog = [];
  loadDeviceSyncLog();

  Devices.loadDevice(self.id).then(function (data) {
    self.device = data;
    spinnerService.hide('device');
  });

  // for a week: 287 -> 2100
  // 5 -> 35

  // Load the device heartbeat
  Devices.loadDeviceHeartbeatLog(self.id, 10).then(function (data) {
    // Convert each heartbeat into a value between 0 and 287 (5 x 12 x 24) since there's a heartbeat every 5 minutes
    var secondsInADay = 60 * 60 * 24;
    data.forEach(function (val) {
      // Get the current time in seconds
      val.CreateDate = new Date(val.CreateDate);
      var seconds = Math.floor((new Date() - val.CreateDate) / 1000);

      // Convert this into a value between 0 and 287
      var beat = 287 - (287 * ((seconds / secondsInADay)));
      val.beat = Math.round(beat);
    });

    self.heartbeat = [];
    var num = 0;
    self.hasHeartbeat = false;
    for (var i = 0; i < 287; i++) {
      // Work out the datetime
      var secondsAgo = (287 - i) * 5 * 60;
      var date = new Date(new Date().getTime() - secondsAgo * 1000);

      if (!self.newDay && date.getHours() === 0) {
        self.newDay = date;
        self.newDayIndex = i;
      }

      // Is this a heartbeat or not?
      var beat = false;
      var k = _.findIndex(data, {
        beat: i
      });
      if (k > -1) {
        self.hasHeartbeat = true;
        beat = true;
        date = data[k].CreateDate;
        num++;
      }

      // If the last record shows disconnected, that's in the last 5 minutes, so who cares. Don't show it.
      if (i === 286 && k === -1) {
        return;
      }

      self.heartbeat.push({
        beat: beat,
        date: date
      });
    }
  });

  function loadDeviceSyncLog() {
    spinnerService.show('synclog');
    // Load the device sync log
    Devices.loadDeviceSyncLog(self.id, self.page, 20).then(function (data) {
      if (self.page === 1) {
        self.synclog = data;
      }
      else {
        self.synclog.DeviceSyncPlaylistSyncs = self.synclog.DeviceSyncPlaylistSyncs.concat(data.DeviceSyncPlaylistSyncs);
      }
      self.loadingMore = false;
      spinnerService.hide('synclog');

      // There are 5 possible sync states:
      // Sync cycle failure (failed to sync, i.e. SyncSuccess = false)
      // Playlist sync error (sync completed, but with playlist sync errors)
      // Sync is in progress
      // Sync cycle didn't complete
      // Sync cycle is complete

      var i = 0;
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
        if (!val.playlistSyncError) {
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
    self.page++;
    loadDeviceSyncLog();
  };
});
