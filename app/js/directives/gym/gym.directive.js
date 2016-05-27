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
    gym.archiveMessage = true;
    gym.alert = undefined;
    if (gym.DeviceCount === 0) {
      //self.disable(gym);
      //return;
    }

    // Start a timer

    // If navigating away while the timer is active, execute the gym disabling anyway (will this happen anyway? Maybe)

    // After 8 seconds, actually execute the gym disabling

  };

  self.disable = function (gym) {
    Gyms.disableGym(gym.Id, false).then(function() {
      gym.alert = {
        type: 'success',
        msg: 'GYM_DISABLED',
        undo: true
      };
      gym.enabled = false;
    }, function () {
      gym.alert = {
        type: 'danger',
        msg: 'DISABLE_GYM_FAILED',
      };
    });
  };

  self.enable = function (gym) {
    gym.Enabled = true;
    gym.alert = undefined;

    gym.put().then(function() {
      gym.alert = {
        type: 'success',
        msg: 'GYM_ENABLED'
      };
      gym.enabled = true;
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