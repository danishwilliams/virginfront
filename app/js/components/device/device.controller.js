angular.module("app.device", []).controller('DeviceController', function ($stateParams, Devices, spinnerService, $modal) {
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

  // Load the device sync log
  Devices.loadDeviceSyncLog(self.id, 1, 20).then(function (data) {
    self.synclog = data;
    spinnerService.hide('device');

    // There are 5 possible sync states:
    // Sync cycle failure (failed to sync, i.e. SyncSuccess = false)
    // Playlist sync error (sync completed, but with playlist sync errors)
    // Sync is in progress
    // Sync cycle didn't complete
    // Sync cycle is complete

    var i = 0;
    self.synclog.DeviceSyncPlaylistSyncs.forEach(function (val) {
      val.timeAgo = val.DeviceSync.CreateDate;
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
      // Exclude the current device from the list
      self.gyms = angular.copy(data);
      self.gyms.data = [];
      data.data.forEach(function (val) {
        if (val.Id !== self.device.Id) {
          self.gyms.data.push(val);
        }
      });
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
    if (self.snapshot.Primary && !self.device.Primary && self.newPrimary) {
      console.log('Made this primary device a secondary: make the chosen secondary device a primary', self.newPrimary);
      self.newPrimary.Primary = true;
      self.newPrimary.route = 'devices/';
      saveDevice(self.newPrimary);
    }

    // Made this secondary device a primary: make the existing primary device a secondary
    if (!self.snapshot.Primary && self.device.Primary && self.gyms.HasPrimary) {
      console.log('Made this secondary device a primary: make the existing primary device a secondary');
      self.gyms.data.forEach(function (val) {
        if (val.Primary) {
          val.Primary = false;
          val.route = "devices/";
          console.log('making this primary device a secondary!', val);
          val.put().then(function () {
            saveDevice();
          });
        }
      });
    }
  };

  function saveDevice(newPrimary) {
    self.device.put().then(function () {
      spinnerService.hide('saveDeviceSpinner');
      if (newPrimary) {
        newPrimary.put().then(function () {
          setDefaultValues();
        });
      } else {
        setDefaultValues();
      }
    });
  }

  function setDefaultValues() {
    self.form.$setPristine();
    self.snapshot.Name = self.device.Name;
    self.snapshot.Primary = self.device.Primary;
    self.saving = false;
    self.edit = false;
  }

  self.popoverContents = function (beat) {
    if (beat.beat) {
      return 'CONNECTED';
    }
    return 'DISCONNECTED';
  };

  self.confirmDeviceDisable = function () {
    var modalInstance = $modal.open({
      templateUrl: '../js/components/device/confirm_device_disable.html',
      controller: 'DeviceDisableModalInstanceCtrl as vm'
    });

    modalInstance.result.then(function (selectedItem) {
      self.result = selectedItem;
      if (self.result) {
        console.log('disable the device!');
      }
    });
  };
});
