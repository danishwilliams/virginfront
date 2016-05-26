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

gymController.$inject = ['Devices', 'spinnerService'];

function gymController(Devices, spinnerService) {
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

    // Load up the devices for this club
    Devices.loadDevicesForGym(gym.Id).then(function (data) {
      spinnerService.hide('gym' + gym.Id);
        gym.devices = data;
    });
  };

  self.archive = function (gym) {
    // Start a timer

      // If navigating away while the timer is active, execute the gym disabling anyway (will this happen anyway? Maybe)

    // After 8 seconds, actually execute the gym disabling


  };

  self.disable = function (gym) {
    gym.archiveMessage = {
      type: 'success',
      msg: 'USER_DISABLED',
      undo: true
    };

    Gyms.disableGym(gym.Id).then(function() {}, function () {
      gym.archiveMessage = {
        type: 'danger',
        msg: 'DISABLE_GYM_FAILED',
      };
    });
  };

  self.enable = function (gym) {
    var gymToSave = angular.copy(gym);
    gymToSave.Enabled = true;

    gymToSave.put().then(function() {
      gym.archiveMessage = {
        type: 'success',
        msg: 'GYM_ENABLED'
      };
    }, function () {
      gym.archiveMessage = {
        type: 'danger',
        msg: 'ENABLE_GYM_FAILED',
      };
    });
  };

  this.update = function (gym) {
    gym.put();
  };
}