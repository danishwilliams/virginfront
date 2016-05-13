angular.module("app.device", []).controller('DeviceController', function ($stateParams, Devices, spinnerService) {
  var self = this;
  this.id = $stateParams.id;

  Devices.loadDevice(self.id).then(function (data) {
    self.device = self.snapshot = data;
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
    for (var i = 0; i <= 287; i++) {
      // Work out the datetime
      var secondsAgo = (287 - i) * 5 * 60;
      var date = new Date(new Date().getTime() - secondsAgo * 1000);

      // Is this a heartbeat or not?
      var beat = false;
      var k = _.findIndex(data, {
        beat: i
      });
      if (k > -1) {
        beat = true;
        date = data[k].CreateDate;
        num++;
      }

      self.heartbeat.push({
        beat: beat,
        date: date
      });
    }
  });

  // Load the device sync log
  Devices.loadDeviceSyncLog(self.id, 1, 20).then(function (data) {
    self.synclog = data;
    spinnerService.hide('device');

    self.synclog.DeviceSyncPlaylistSyncs.forEach(function (val) {
      if (val.DeviceSync.SyncSuccess === false) {
        // Sync cycle failure
        val.syncFailure = true;
        val.timeAgo = val.DeviceSync.SyncEndDate;
      } else {
        // Loop through DevicePlaylistSyncs to see if there's an error
        val.DevicePlaylistSyncs.forEach(function (val1) {
          if (val1.SyncError && !val.playlistSyncError) {
            val.playlistSyncError = true;
            val.timeAgo = val1.CreateDate;

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

  self.editClick = function () {
    self.edit = true;
    self.snapshot = {
      Name: self.device.Name,
      Primary: self.device.Primary
    };

    // Load up the devices for this club
    Devices.loadDevicesForGym(self.device.Gym.Id).then(function (data) {
      self.gyms = data;
      console.log(data);
    });
  };

  self.editCancelled = function () {
    self.device.Name = self.snapshot.Name;
    self.device.Primary = self.snapshot.Primary;
    self.form.$setPristine();
    self.edit = false;
  };

  this.saveDevice = function () {
    //spinnerService.show('saveDeviceSpinner');
    //self.saving = true;
    console.log('saving');

    // Normal save: just edited the device name

    // Made this primary device a secondary: make the chosen secondary device a primary
    if (self.snapshot.Primary && !self.device.Primary) {
      console.log('Made this primary device a secondary: make the chosen secondary device a primary');
    }

    // Made this secondary device a primary: make the existing primary device a secondary
    if (!self.snapshot.Primary && self.device.Primary) {
      console.log('Made this secondary device a primary: make the existing primary device a secondary');
    }

    /*
    self.device.put().then(function() {
      spinnerService.hide('saveDeviceSpinner');
      self.saving = false;
    });
    */
  };

  self.popoverContents = function (beat) {
    if (beat.beat) {
      return 'CONNECTED';
    }
    return 'DISCONNECTED';
  };
});
