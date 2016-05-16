angular.module("app.device_edit", []).controller('DeviceEditController', function ($state, $stateParams, Devices, spinnerService) {
  var self = this;
  self.id = $stateParams.id;
  self.state = $state.current.name; // device-edit or device-disable

  Devices.loadDevice(self.id).then(function (data) {
    self.device = data;
    self.snapshot = angular.copy(data);
    spinnerService.hide('device');
    loadDevicesForGym();
  });

  function loadDevicesForGym() {
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
  }

  this.saveDevice = function () {
    spinnerService.show('saveDeviceSpinner');
    self.saving = true;

    // Made this primary device a secondary: make the chosen secondary device a primary
    if (self.snapshot.Primary && !self.device.Primary && self.newPrimary) {
      console.log('Made this primary device a secondary: make the chosen secondary device a primary', self.newPrimary);
      self.newPrimary.Primary = true;
      self.newPrimary.route = 'devices/';
      saveDevice(self.newPrimary);
    }

    // Made this secondary device a primary: make the existing primary device a secondary
    else if (!self.snapshot.Primary && self.device.Primary && self.gyms.HasPrimary) {
      console.log('Made this secondary device a primary: make the existing primary device a secondary');
      self.gyms.data.forEach(function (val) {
        if (val.Primary) {
          val.Primary = false;
          val.route = "devices/";
          console.log('making this primary device a secondary!', val);
          val.put().then(function () {
            saveDevice();
          }, function () {
            saveError();
          });
        }
      });
    }

    else {
      saveDevice();
    }
  };

  function saveDevice(newPrimary) {
    self.device.put().then(function () {
      spinnerService.hide('saveDeviceSpinner');
      if (newPrimary) {
        newPrimary.put().then(function () {
          saveComplete();
        }, function() {
          saveError();
        });
      } else {
        saveComplete();
      }
    }, function() {
      saveError();
    });
  }

  function saveComplete() {
    self.snapshot.Name = self.device.Name;
    self.snapshot.Primary = self.device.Primary;
    self.saved = true;
    self.alert = {
      type: 'success',
      msg: 'DEVICE_SAVED'
    };
  }

  function saveError() {
    self.saved = true;
    self.alert = {
      type: 'warning',
      msg: 'DEVICE_SAVE_ERROR'
    };
  }
});
