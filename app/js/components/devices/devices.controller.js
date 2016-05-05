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
        val.timeAgoError = timeSince(val.LastHeartbeat);
      }
      else {
        val.PlaylistSyncFailures.forEach(function(val1) {
          if (val1.SyncError && !val.timeAgoError) {
            val.error = true;
            val.timeAgoError = timeSince(val1.CreateDate);
          }
        });
      }

      // What was the time ago?
      val.timeAgo = timeSince(val.LastHeartbeat);
    });
  });

  /**
   * @see http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
   */
  function timeSince(date) {
    var seconds = Math.floor((new Date() - new Date(date)) / 1000);

    var interval = Math.floor(seconds / 31536000);
    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }    interval = Math.floor(seconds / 60);
    return interval + " mins ago";
  }

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
