angular
  .module("app")
  .directive("gym", gym);

function gym() {
  var directive = {
    templateUrl: '../js/directives/gym/gym.directive.html',
    restrict: 'E',
    controller: gymController,
    controllerAs: 'vm'
  };
  return directive;
}

gymController.$inject = ['Devices', 'spinnerService', '$interval', 'Gyms'];

function gymController(Devices, spinnerService, $interval, Gyms) {
  var self = this;

  self.loadDevicesForGym = function (gym) {
    if (gym.opened) {
      // We've already loaded up devices for this club, so don't do it again
      return;
    }
    else {
      gym.opened = true;
    }
    spinnerService.show('gym' + gym.Id);
    gym.enabled = gym.Enabled;

    // Load up the devices for this club
    Devices.loadDevicesForGym(gym.Id).then(function (data) {
      spinnerService.hide('gym' + gym.Id);
        gym.devices = data;
    });
  };

  self.archive = function (gym) {
    gym.alert = undefined;
    // If this gym doesn't have any devices, just archive it
    if (gym.DeviceCount === 0) {
      self.saving = true;
      self.disable(gym, false);
      return;
    }

    gym.archiveMessage = true;

    // This gym has devices, so give the user 8 seconds grace before actually disabling it
    gym.interval = $interval(function() {
      gym.archiveMessage = undefined;
      self.saving = true;
      self.disable(gym, true);
    }, 8000, 1);
  };

  self.undo = function(gym) {
    $interval.cancel(gym.interval);
    gym.interval = undefined;
    gym.alert = undefined;
    gym.archived = false;
    gym.archiveMessage = undefined;
    gym.enabled = true;
    gym.Enabled = true;
  };

  self.disable = function (gym, disableDevices) {
    Gyms.disableGym(gym.Id, disableDevices).then(function() {
      gym.archiveMessage = undefined;
      gym.archived = true;
      gym.enabled = false;
      self.saving = false;

      gym.alert = {
        type: 'success',
        msg: 'GYM_ARCHIVE_WARNING',
        undo: true
      };
    }, function () {
      gym.alert = {
        type: 'danger',
        msg: 'GYM_ARCHIVE_FAILED',
      };
    });
  };

  self.enable = function (gym) {
    gym.Enabled = true;
    gym.alert = undefined;
    gym.archiveMessage = undefined;
    self.saving = true;

    gym.put().then(function() {
      gym.archived = false;
      gym.enabled = true;
      self.saving = false;
      gym.alert = {
        type: 'success',
        msg: 'GYM_ENABLED'
      };
    }, function () {
      gym.alert = {
        type: 'danger',
        msg: 'ENABLE_GYM_FAILED',
      };
    });
  };

  this.update = function (gym) {
    gym.put();
  };
}